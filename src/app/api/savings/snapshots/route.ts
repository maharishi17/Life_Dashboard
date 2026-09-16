import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionUserId = cookieStore.get("ld-session")?.value;
    if (!sessionUserId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const snapshots = await prisma.monthlySnapshot.findMany({
      orderBy: [
        { year: 'asc' },
        { month: 'asc' }
      ]
    });

    return NextResponse.json({ snapshots }, { status: 200 });
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
    const { year, month, notes } = body;

    if (!year || !month) {
      return NextResponse.json({ error: "Year and Month are required" }, { status: 400 });
    }

    // Check if snapshot already exists for this month
    const existing = await prisma.monthlySnapshot.findUnique({
      where: {
        year_month: { year: parseInt(year), month: parseInt(month) }
      }
    });

    if (existing) {
      return NextResponse.json({ error: "A snapshot for this month already exists." }, { status: 400 });
    }

    // Calculate current totals
    
    // 1. Total liquid savings (Accounts)
    const accounts = await prisma.account.findMany();
    // Default AED to INR rate (if ExchangeRates is empty, fallback to env)
    const latestRate = await prisma.exchangeRate.findFirst({
      where: { fromCurrency: 'AED', toCurrency: 'INR' },
      orderBy: { date: 'desc' }
    });
    const AED_TO_INR = latestRate ? latestRate.rate : parseFloat(process.env.DEFAULT_AED_TO_INR_RATE || "22.5");

    let totalSavingsINR = 0;
    accounts.forEach(a => {
      totalSavingsINR += (a.currency === 'AED' ? a.balance * AED_TO_INR : a.balance);
    });

    // 2. Total outstanding loans
    const loans = await prisma.loan.findMany({ where: { isCleared: false } });
    let totalLoansINR = 0;
    loans.forEach(l => {
      // Assuming loans are recorded in INR (since we didn't add currency to Loan model)
      totalLoansINR += l.currentBalance;
    });

    // 3. Total Income & Expense (for historical record in snapshot)
    // Note: To be perfectly accurate for a "monthly" snapshot, we could filter transactions by this month,
    // but a common pattern is to just snapshot the running cumulative totals. We will snapshot cumulative.
    const transactions = await prisma.transaction.findMany();
    let totalIncomeINR = 0;
    let totalExpenseINR = 0;
    transactions.forEach(t => {
      if (t.type === 'INCOME') totalIncomeINR += t.amountInINR;
      if (t.type === 'EXPENSE') totalExpenseINR += t.amountInINR;
    });

    // 4. Calculate Net Worth
    const netWorthINR = totalSavingsINR - totalLoansINR;

    // Save Snapshot
    const snapshot = await prisma.monthlySnapshot.create({
      data: {
        year: parseInt(year),
        month: parseInt(month),
        totalIncomeINR,
        totalExpenseINR,
        totalSavingsINR,
        totalLoansINR,
        netWorthINR,
        aedToInrRate: AED_TO_INR,
        notes
      }
    });

    return NextResponse.json({ snapshot, message: "Snapshot saved successfully!" }, { status: 201 });
  } catch (error) {
    console.error("Snapshot error:", error);
    return NextResponse.json({ error: "Failed to generate snapshot" }, { status: 500 });
  }
}
