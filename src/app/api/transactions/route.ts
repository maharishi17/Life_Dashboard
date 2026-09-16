import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { TransactionType, Currency } from "@prisma/client";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionUserId = cookieStore.get("ld-session")?.value;
    if (!sessionUserId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const transactions = await prisma.transaction.findMany({
      include: { 
        user: { select: { name: true } },
        account: { select: { name: true, currency: true } }
      },
      orderBy: { date: 'desc' },
      take: 50 // limit to recent 50 for performance
    });
    return NextResponse.json({ transactions }, { status: 200 });
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
    const { type, amount, accountId, category, description, date } = body;

    if (!amount || !accountId || !category || !date) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const parsedAmount = parseFloat(amount);
    if (parsedAmount <= 0) {
      return NextResponse.json({ error: "Amount must be greater than zero" }, { status: 400 });
    }

    // Get the account to determine currency
    const account = await prisma.account.findUnique({ where: { id: accountId } });
    if (!account) return NextResponse.json({ error: "Account not found" }, { status: 404 });

    const AED_TO_INR = parseFloat(process.env.DEFAULT_AED_TO_INR_RATE || "22.5");
    let amountInINR = parsedAmount;
    if (account.currency === 'AED') {
      amountInINR = parsedAmount * AED_TO_INR;
    }

    // Wrap in a transaction to ensure both transaction creation and account balance update succeed
    const transaction = await prisma.$transaction(async (tx) => {
      // 1. Create the transaction record
      const newTx = await tx.transaction.create({
        data: {
          type: type as TransactionType,
          amount: parsedAmount,
          currency: account.currency,
          amountInINR,
          category,
          description,
          date: new Date(date),
          userId: sessionUserId,
          accountId,
        }
      });

      // 2. Update the account balance
      const balanceChange = (type === 'INCOME') ? parsedAmount : -parsedAmount;
      await tx.account.update({
        where: { id: accountId },
        data: { balance: { increment: balanceChange } }
      });

      return newTx;
    });

    return NextResponse.json({ transaction, message: "Transaction added successfully!" }, { status: 201 });
  } catch (error) {
    console.error("Transaction creation error:", error);
    return NextResponse.json({ error: "Failed to add transaction" }, { status: 500 });
  }
}
