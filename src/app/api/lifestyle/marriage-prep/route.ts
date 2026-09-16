import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionUserId = cookieStore.get("ld-session")?.value;
    if (!sessionUserId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const items = await prisma.marriagePrepItem.findMany({
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ items }, { status: 200 });
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
    const { name, estimatedCost, currency } = body;

    if (!name || !estimatedCost) return NextResponse.json({ error: "Name and estimated cost are required" }, { status: 400 });

    const item = await prisma.marriagePrepItem.create({
      data: {
        name,
        estimatedCost: parseFloat(estimatedCost),
        currency: currency || "INR"
      }
    });

    return NextResponse.json({ item }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to add item" }, { status: 500 });
  }
}
