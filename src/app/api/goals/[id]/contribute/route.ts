import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const cookieStore = await cookies();
    const sessionUserId = cookieStore.get("ld-session")?.value;
    if (!sessionUserId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const goalId = params.id;
    const body = await req.json();
    const { amount, currency, date, note } = body;

    if (!amount || parseFloat(amount) <= 0 || !date) {
      return NextResponse.json({ error: "Valid amount and date are required" }, { status: 400 });
    }

    const parsedAmount = parseFloat(amount);
    
    // Simplistic INR conversion for now
    const AED_TO_INR = parseFloat(process.env.DEFAULT_AED_TO_INR_RATE || "22.5");
    const amountInINR = currency === 'AED' ? parsedAmount * AED_TO_INR : parsedAmount;

    // Transaction to ensure data integrity during contribution & potential unlocking
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create contribution record
      const contribution = await tx.goalContribution.create({
        data: {
          amount: parsedAmount,
          currency: currency || 'INR',
          amountInINR,
          note,
          contributedAt: new Date(date),
          goalId,
        }
      });

      // 2. Update goal current amount
      const goal = await tx.goal.findUnique({ where: { id: goalId } });
      if (!goal) throw new Error("Goal not found");

      const newAmount = goal.currentAmount + amountInINR;
      const isAchieved = newAmount >= goal.targetAmount;
      
      let status = goal.status;
      if (isAchieved && status !== 'ACHIEVED') {
        status = 'ACHIEVED';
      }

      await tx.goal.update({
        where: { id: goalId },
        data: {
          currentAmount: newAmount,
          status,
          achievedAt: isAchieved ? new Date() : null,
        }
      });

      // 3. Unlock logic: If this goal is achieved, check if any goals depend on it and unlock them
      if (isAchieved) {
        const dependentGoals = await tx.goal.findMany({
          where: { unlockAfterGoalId: goalId, status: 'LOCKED' }
        });

        for (const depGoal of dependentGoals) {
          await tx.goal.update({
            where: { id: depGoal.id },
            data: { status: 'ACTIVE' }
          });
        }
      }

      return contribution;
    });

    return NextResponse.json({ contribution: result, message: "Contribution recorded successfully!" }, { status: 201 });
  } catch (error) {
    console.error("Goal contribution error:", error);
    return NextResponse.json({ error: "Failed to record contribution" }, { status: 500 });
  }
}
