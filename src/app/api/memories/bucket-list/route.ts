import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionUserId = cookieStore.get("ld-session")?.value;
    if (!sessionUserId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const items = await prisma.bucketListItem.findMany({
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
    const { title } = body;

    if (!title) return NextResponse.json({ error: "Title is required" }, { status: 400 });

    const item = await prisma.bucketListItem.create({
      data: { title }
    });

    return NextResponse.json({ item }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to add item" }, { status: 500 });
  }
}
