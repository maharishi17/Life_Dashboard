import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { pin } = await req.json();

    if (!pin || typeof pin !== "string" || pin.length < 4) {
      return NextResponse.json({ error: "PIN is required" }, { status: 400 });
    }

    // Fetch all users from database (only 2 — very fast)
    const users = await prisma.user.findMany();

    // Find the user whose hashed PIN matches
    let matchedUser = null;
    for (const user of users) {
      const isMatch = await bcrypt.compare(pin, user.pinHash);
      if (isMatch) {
        matchedUser = user;
        break;
      }
    }

    if (!matchedUser) {
      // Small delay to prevent brute-force timing attacks
      await new Promise((resolve) => setTimeout(resolve, 500));
      return NextResponse.json(
        { error: "Wrong PIN. Try again." },
        { status: 401 }
      );
    }

    // Create session cookie (httpOnly, 30 days)
    const cookieStore = await cookies();
    cookieStore.set("ld-session", matchedUser.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });

    // Return safe user object (no PIN hash)
    return NextResponse.json(
      {
        user: {
          id: matchedUser.id,
          name: matchedUser.name,
          role: matchedUser.role,
          currency: matchedUser.currency,
          location: matchedUser.location,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Server error. Please try again." },
      { status: 500 }
    );
  }
}
