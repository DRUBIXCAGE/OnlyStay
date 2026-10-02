import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const [blockedDates, bookings] = await Promise.all([
      prisma.blockedDate.findMany({
        where: { listingId: id },
        orderBy: { date: "asc" },
      }),
      prisma.booking.findMany({
        where: {
          listingId: id,
          status: { in: ["CONFIRMED", "CHECKED_IN", "PENDING"] },
        },
        select: {
          id: true,
          startDate: true,
          endDate: true,
          status: true,
          guest: {
            select: { name: true, image: true },
          },
        },
      }),
    ]);

    return NextResponse.json({ blockedDates, bookings });
  } catch (error: any) {
    console.error("GET availability error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch availability" }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { date, action, reason } = await request.json();

    if (!date) {
      return NextResponse.json({ error: "Date is required" }, { status: 400 });
    }

    const targetDate = new Date(date);
    // Normalize to start of day
    targetDate.setHours(0, 0, 0, 0);

    if (action === "unblock") {
      await prisma.blockedDate.deleteMany({
        where: {
          listingId: id,
          date: targetDate,
        },
      });
      return NextResponse.json({ success: true, action: "unblocked" });
    } else {
      // Check if already blocked
      const existing = await prisma.blockedDate.findFirst({
        where: {
          listingId: id,
          date: targetDate,
        },
      });

      if (!existing) {
        await prisma.blockedDate.create({
          data: {
            listingId: id,
            date: targetDate,
            reason: reason || "Manual block by host",
          },
        });
      }
      return NextResponse.json({ success: true, action: "blocked" });
    }
  } catch (error: any) {
    console.error("POST availability error:", error);
    return NextResponse.json({ error: error.message || "Failed to update availability" }, { status: 500 });
  }
}
