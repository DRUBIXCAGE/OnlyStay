import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { BookingSchema } from "@/lib/validations";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const guestId = searchParams.get("guestId");
    const hostId = searchParams.get("hostId");

    const where: any = {};

    if (guestId) {
      where.guestId = guestId;
    }

    if (hostId) {
      where.listing = {
        hostId: hostId,
      };
    }

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        listing: {
          include: {
            images: {
              where: { orderIndex: 0 },
              take: 1,
            },
            host: {
              select: {
                id: true,
                name: true,
                image: true,
                phone: true,
              },
            },
          },
        },
        guest: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            phone: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ bookings });
  } catch (error: any) {
    console.error("GET /api/bookings error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch bookings" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = BookingSchema.parse(body);

    const start = new Date(validatedData.startDate);
    const end = new Date(validatedData.endDate);

    if (start >= end) {
      return NextResponse.json({ error: "Check-out date must be after check-in date" }, { status: 400 });
    }

    // Transactional availability check & lock
    const result = await prisma.$transaction(async (tx) => {
      // 1. Check for overlapping confirmed or checked-in bookings
      const overlappingBookings = await tx.booking.findFirst({
        where: {
          listingId: validatedData.listingId,
          status: { in: ["CONFIRMED", "CHECKED_IN", "PENDING"] },
          OR: [
            {
              startDate: { lte: start },
              endDate: { gt: start },
            },
            {
              startDate: { lt: end },
              endDate: { gte: end },
            },
            {
              startDate: { gte: start },
              endDate: { lte: end },
            },
          ],
        },
      });

      if (overlappingBookings) {
        throw new Error("Selected dates are no longer available. Please choose another date range.");
      }

      // 2. Check for host blocked dates
      const blockedDates = await tx.blockedDate.findFirst({
        where: {
          listingId: validatedData.listingId,
          date: {
            gte: start,
            lt: end,
          },
        },
      });

      if (blockedDates) {
        throw new Error("These dates have been blocked by the host.");
      }

      // 3. Calculate nights
      const nights = Math.max(1, Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));

      // 4. Create the booking
      const booking = await tx.booking.create({
        data: {
          listingId: validatedData.listingId,
          guestId: validatedData.guestId,
          startDate: start,
          endDate: end,
          nights,
          guestsCount: validatedData.guestsCount,
          pricePerNight: validatedData.pricePerNight,
          cleaningFee: validatedData.cleaningFee,
          serviceFee: validatedData.serviceFee,
          totalPrice: validatedData.totalPrice,
          status: validatedData.isInstant ? "CONFIRMED" : "PENDING",
          isInstant: validatedData.isInstant,
          paymentStatus: validatedData.isInstant ? "PAID" : "PENDING",
          stripePaymentId: validatedData.stripePaymentId || `pi_sim_${Date.now()}_${Math.random().toString(36).substring(7)}`,
          guestNote: validatedData.guestNote,
        },
        include: {
          listing: {
            select: {
              title: true,
              address: true,
              city: true,
              country: true,
            },
          },
        },
      });

      return booking;
    });

    return NextResponse.json({ booking: result }, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/bookings error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create reservation" },
      { status: 400 }
    );
  }
}
