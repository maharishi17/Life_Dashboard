import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionUserId = cookieStore.get("ld-session")?.value;
    if (!sessionUserId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const subscriptions = await prisma.subscription.findMany({
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ subscriptions }, { status: 200 });
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
    const { name, cost, currency, billingCycle } = body;

    if (!name || !cost) return NextResponse.json({ error: "Name and cost are required" }, { status: 400 });

    const sub = await prisma.subscription.create({
      data: {
        name,
        cost: parseFloat(cost),
        currency: currency || "INR",
        billingCycle: billingCycle || "MONTHLY"
      }
    });

    return NextResponse.json({ subscription: sub }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to add subscription" }, { status: 500 });
  }
}
