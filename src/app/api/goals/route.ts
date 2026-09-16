import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionUserId = cookieStore.get("ld-session")?.value;
    if (!sessionUserId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const goals = await prisma.goal.findMany({
      include: {
        unlocksGoal: { select: { name: true } }
      },
      orderBy: { unlockOrder: 'asc' }
    });

    return NextResponse.json({ goals }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionUserId = cookieStore.get("ld-session")?.value;
    if (!sessionUserId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { name, emoji, targetAmount, targetDate, unlockAfterGoalId, unlockOrder } = body;

    if (!name || !targetAmount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const goal = await prisma.goal.create({
      data: {
        name,
        emoji: emoji || "🎯",
        targetAmount: parseFloat(targetAmount),
        targetDate: targetDate ? new Date(targetDate) : null,
        unlockAfterGoalId: unlockAfterGoalId || null,
        unlockOrder: unlockOrder ? parseInt(unlockOrder, 10) : 0,
        status: unlockAfterGoalId ? 'LOCKED' : 'ACTIVE', // If it depends on a goal, it's LOCKED initially
      }
    });

    return NextResponse.json({ goal, message: "Goal added successfully!" }, { status: 201 });
  } catch (error) {
    console.error("Goal creation error:", error);
    return NextResponse.json({ error: "Failed to create goal" }, { status: 500 });
  }
}
