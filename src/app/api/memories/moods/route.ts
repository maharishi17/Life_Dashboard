import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionUserId = cookieStore.get("ld-session")?.value;
    if (!sessionUserId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const moods = await prisma.moodNote.findMany({
      include: { user: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
      take: 50
    });

    return NextResponse.json({ moods }, { status: 200 });
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
    const { emoji, note } = body;

    if (!emoji) return NextResponse.json({ error: "Emoji is required" }, { status: 400 });

    const mood = await prisma.moodNote.create({
      data: {
        userId: sessionUserId,
        emoji,
        note
      },
      include: { user: { select: { name: true } } }
    });

    return NextResponse.json({ mood }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to add mood" }, { status: 500 });
  }
}
