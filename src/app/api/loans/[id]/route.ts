import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const cookieStore = await cookies();
    const sessionUserId = cookieStore.get("ld-session")?.value;
    if (!sessionUserId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;

    // First delete all related payments
    await prisma.loanPayment.deleteMany({
      where: { loanId: id }
    });

    // Then delete the loan
    await prisma.loan.delete({
      where: { id } 
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete loan" }, { status: 500 });
  }
}
