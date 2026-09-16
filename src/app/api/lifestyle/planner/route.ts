import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionUserId = cookieStore.get("ld-session")?.value;
    if (!sessionUserId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");

    if (!type) return NextResponse.json({ error: "Missing type" }, { status: 400 });

    const item = await prisma.vaultItem.findFirst({
      where: { type }
    });

    return NextResponse.json({ content: item?.content || "" }, { status: 200 });
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
    const { type, content } = body;

    if (!type) return NextResponse.json({ error: "Missing type" }, { status: 400 });

    // Find existing
    const existing = await prisma.vaultItem.findFirst({ where: { type } });

    if (existing) {
      const updated = await prisma.vaultItem.update({
        where: { id: existing.id },
        data: { content }
      });
      return NextResponse.json({ success: true, item: updated }, { status: 200 });
    } else {
      const created = await prisma.vaultItem.create({
        data: {
          title: type,
          type,
          content
        }
      });
      return NextResponse.json({ success: true, item: created }, { status: 201 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to update planner" }, { status: 500 });
  }
}
