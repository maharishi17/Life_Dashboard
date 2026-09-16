import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionUserId = cookieStore.get("ld-session")?.value;
    if (!sessionUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1. Get total balance from Accounts
    // We sum up balance in INR
    const accounts = await prisma.account.findMany();
    
    // Simplification for V1:
    // If account currency is AED, multiply by default rate (e.g. 22.5) to get INR equivalent.
    // In future phases, we can fetch real-time exchange rates.
    const AED_TO_INR = parseFloat(process.env.DEFAULT_AED_TO_INR_RATE || "22.5");
    
    let totalBalanceINR = 0;
    accounts.forEach(acc => {
      if (acc.currency === 'AED') {
        totalBalanceINR += acc.balance * AED_TO_INR;
      } else {
        totalBalanceINR += acc.balance;
      }
    });

    // 2. Get active loans total
    const loans = await prisma.loan.findMany({ where: { isCleared: false } });
    const totalLoans = loans.reduce((sum, loan) => sum + loan.currentBalance, 0);

    // 3. Get total savings
    // We can calculate savings from goals contributions, or from a specific account type.
    // For now, let's sum up all 'GoalContribution' amountInINR.
    const contributions = await prisma.goalContribution.findMany();
    const totalSavings = contributions.reduce((sum, c) => sum + c.amountInINR, 0);

    // 4. Get active goals count
    const activeGoalsCount = await prisma.goal.count({ where: { status: 'ACTIVE' } });

    return NextResponse.json({
      totalBalance: totalBalanceINR,
      totalLoans,
      totalSavings,
      activeGoalsCount
    }, { status: 200 });

  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
