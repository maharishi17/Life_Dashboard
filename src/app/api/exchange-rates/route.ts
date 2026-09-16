import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { Currency } from "@prisma/client";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionUserId = cookieStore.get("ld-session")?.value;
    if (!sessionUserId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Get the latest AED -> INR rate
    const latestRate = await prisma.exchangeRate.findFirst({
      where: { fromCurrency: 'AED', toCurrency: 'INR' },
      orderBy: { date: 'desc' }
    });

    const rate = latestRate ? latestRate.rate : parseFloat(process.env.DEFAULT_AED_TO_INR_RATE || "22.5");

    return NextResponse.json({ rate }, { status: 200 });
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
    const { rate } = body;

    if (!rate || parseFloat(rate) <= 0) {
      return NextResponse.json({ error: "Valid exchange rate required" }, { status: 400 });
    }

    const newRate = await prisma.exchangeRate.create({
      data: {
        fromCurrency: Currency.AED,
        toCurrency: Currency.INR,
        rate: parseFloat(rate),
        date: new Date()
      }
    });

    return NextResponse.json({ rate: newRate.rate, message: "Exchange rate updated successfully!" }, { status: 201 });
  } catch (error) {
    console.error("Exchange rate error:", error);
    return NextResponse.json({ error: "Failed to update exchange rate" }, { status: 500 });
  }
}
