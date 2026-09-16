import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionUserId = cookieStore.get("ld-session")?.value;
    if (!sessionUserId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const loans = await prisma.loan.findMany({
      include: { payments: { orderBy: { paidOn: 'desc' }, take: 1 } },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ loans }, { status: 200 });
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
    const { name, lender, principalAmount, currentBalance, emiAmount, interestRate, startDate, endDate, notes } = body;

    if (!name || !principalAmount || !currentBalance || !startDate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const loan = await prisma.loan.create({
      data: {
        name,
        lender,
        principalAmount: parseFloat(principalAmount),
        currentBalance: parseFloat(currentBalance),
        emiAmount: emiAmount ? parseFloat(emiAmount) : 0,
        interestRate: interestRate ? parseFloat(interestRate) : null,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        notes,
      }
    });

    return NextResponse.json({ loan, message: "Loan added successfully!" }, { status: 201 });
  } catch (error) {
    console.error("Loan creation error:", error);
    return NextResponse.json({ error: "Failed to create loan" }, { status: 500 });
  }
}
