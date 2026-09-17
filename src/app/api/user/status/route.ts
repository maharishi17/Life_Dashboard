import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session");
    if (!sessionCookie?.value) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Identify current user
    const currentUserId = sessionCookie.value;

    // Update current user's lastActiveAt to now
    await prisma.user.update({
      where: { id: currentUserId },
      data: { lastActiveAt: new Date() }
    });

    // Fetch all users to return their statuses
    const allUsers = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        lastActiveAt: true
      }
    });

    return NextResponse.json({ users: allUsers });
  } catch (error) {
    console.error("Status API Error:", error);
    return NextResponse.json({ error: "Failed to fetch status" }, { status: 500 });
  }
}
