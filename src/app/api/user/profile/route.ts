import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

// GET — fetch current user profile
export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionUserId = cookieStore.get("ld-session")?.value;
    if (!sessionUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: sessionUserId },
      select: { id: true, name: true, role: true, currency: true, location: true, createdAt: true },
    });

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// PATCH — update name, location, or PIN
export async function PATCH(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionUserId = cookieStore.get("ld-session")?.value;
    if (!sessionUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, location, currentPin, newPin } = body;

    const updateData: Record<string, string> = {};

    // Update name if provided
    if (name && typeof name === "string" && name.trim().length > 0) {
      updateData.name = name.trim();
    }

    // Update location if provided
    if (location && typeof location === "string" && location.trim().length > 0) {
      updateData.location = location.trim();
    }

    // Update PIN if provided — verify current PIN first
    if (newPin) {
      if (!currentPin) {
        return NextResponse.json({ error: "Current PIN is required to set a new PIN" }, { status: 400 });
      }
      if (newPin.length < 4 || newPin.length > 8) {
        return NextResponse.json({ error: "New PIN must be 4-8 digits" }, { status: 400 });
      }

      const user = await prisma.user.findUnique({ where: { id: sessionUserId } });
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      const isCurrentPinValid = await bcrypt.compare(currentPin, user.pinHash);
      if (!isCurrentPinValid) {
        return NextResponse.json({ error: "Current PIN is wrong" }, { status: 401 });
      }

      updateData.pinHash = await bcrypt.hash(newPin, 12);
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
    }

    const updated = await prisma.user.update({
      where: { id: sessionUserId },
      data: updateData,
      select: { id: true, name: true, role: true, currency: true, location: true },
    });

    return NextResponse.json({ user: updated, message: "Profile updated successfully!" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
