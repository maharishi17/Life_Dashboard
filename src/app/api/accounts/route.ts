import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { AccountType, Currency } from "@prisma/client";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionUserId = cookieStore.get("ld-session")?.value;
    if (!sessionUserId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const accounts = await prisma.account.findMany({
      include: { user: { select: { name: true } } },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json({ accounts }, { status: 200 });
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
    const { name, type, currency, balance, bankName, accountNo } = body;

    if (!name) return NextResponse.json({ error: "Account name is required" }, { status: 400 });

    const account = await prisma.account.create({
      data: {
        name,
        type: type as AccountType || 'SAVINGS',
        currency: currency as Currency || 'INR',
        balance: parseFloat(balance) || 0,
        bankName,
        accountNo,
        userId: sessionUserId
      }
    });

    return NextResponse.json({ account, message: "Account added successfully!" }, { status: 201 });
  } catch (error) {
    console.error("Account creation error:", error);
    return NextResponse.json({ error: "Failed to create account" }, { status: 500 });
  }
}
