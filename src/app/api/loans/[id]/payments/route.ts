import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const cookieStore = await cookies();
    const sessionUserId = cookieStore.get("ld-session")?.value;
    if (!sessionUserId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const loanId = params.id;
    const body = await req.json();
    const { amount, currency, date, notes } = body;

    if (!amount || parseFloat(amount) <= 0 || !date) {
      return NextResponse.json({ error: "Valid amount and date are required" }, { status: 400 });
    }

    const parsedAmount = parseFloat(amount);
    
    // Simplistic INR conversion for now
    const AED_TO_INR = parseFloat(process.env.DEFAULT_AED_TO_INR_RATE || "22.5");
    const amountInINR = currency === 'AED' ? parsedAmount * AED_TO_INR : parsedAmount;

    // Use a transaction to create the payment and update the loan balance
    const result = await prisma.$transaction(async (tx) => {
      const payment = await tx.loanPayment.create({
        data: {
          amount: parsedAmount,
          currency: currency || 'INR',
          amountInINR,
          paidOn: new Date(date),
          notes,
          loanId,
          userId: sessionUserId,
        }
      });

      // Fetch current loan to check if this payment clears it
      const loan = await tx.loan.findUnique({ where: { id: loanId } });
      if (!loan) throw new Error("Loan not found");

      const newBalance = Math.max(0, loan.currentBalance - parsedAmount);
      const isCleared = newBalance === 0;

      await tx.loan.update({
        where: { id: loanId },
        data: {
          currentBalance: newBalance,
          isCleared,
          clearedAt: isCleared ? new Date() : null,
        }
      });

      return payment;
    });

    return NextResponse.json({ payment: result, message: "Payment recorded successfully!" }, { status: 201 });
  } catch (error) {
    console.error("Loan payment error:", error);
    return NextResponse.json({ error: "Failed to record payment" }, { status: 500 });
  }
}
