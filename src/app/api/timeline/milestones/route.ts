import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionUserId = cookieStore.get("ld-session")?.value;
    if (!sessionUserId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const milestones = await prisma.lifeMilestone.findMany({
      orderBy: { year: 'asc' }
    });

    return NextResponse.json({ milestones }, { status: 200 });
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
    const { year, title, description, icon } = body;

    if (!year || !title) return NextResponse.json({ error: "Year and Title are required" }, { status: 400 });

    const milestone = await prisma.lifeMilestone.create({
      data: {
        year: parseInt(year),
        title,
        description,
        icon: icon || "📌"
      }
    });

    return NextResponse.json({ milestone }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to add milestone" }, { status: 500 });
  }
}
