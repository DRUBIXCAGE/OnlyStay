import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { status } = await request.json();

    const validStatuses = ["PENDING", "CONFIRMED", "CHECKED_IN", "COMPLETED", "CANCELED"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid booking status" }, { status: 400 });
    }

    const updated = await prisma.booking.update({
      where: { id },
      data: { status },
      include: {
        listing: {
          select: { title: true },
        },
      },
    });

    return NextResponse.json({ booking: updated });
  } catch (error: any) {
    console.error("PATCH /api/bookings/[id] error:", error);
    return NextResponse.json({ error: error.message || "Failed to update booking status" }, { status: 400 });
  }
}
