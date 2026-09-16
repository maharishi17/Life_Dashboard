import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { writeFile } from "fs/promises";
import { join } from "path";
import { randomUUID } from "crypto";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionUserId = cookieStore.get("ld-session")?.value;
    if (!sessionUserId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const memories = await prisma.scrapbookMemory.findMany({
      orderBy: { date: 'desc' }
    });

    return NextResponse.json({ memories }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionUserId = cookieStore.get("ld-session")?.value;
    if (!sessionUserId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const formData = await req.formData();
    const title = formData.get("title") as string;
    const dateStr = formData.get("date") as string;
    const file = formData.get("image") as File;

    if (!title || !file) {
      return NextResponse.json({ error: "Title and Image are required" }, { status: 400 });
    }

    // Process file upload
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Create unique filename
    const ext = file.name.split('.').pop() || 'jpg';
    const filename = `${randomUUID()}.${ext}`;
    const uploadPath = join(process.cwd(), "public", "uploads", filename);
    
    // Save locally
    await writeFile(uploadPath, buffer);
    const imageUrl = `/uploads/${filename}`;

    const memory = await prisma.scrapbookMemory.create({
      data: {
        title,
        date: dateStr ? new Date(dateStr) : new Date(),
        imageUrl
      }
    });

    return NextResponse.json({ memory }, { status: 201 });
  } catch (error) {
    console.error("Scrapbook upload error:", error);
    return NextResponse.json({ error: "Failed to save memory" }, { status: 500 });
  }
}
