import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const listing = await prisma.listing.findUnique({
      where: { id },
      include: {
        images: {
          orderBy: { orderIndex: "asc" },
        },
        amenities: true,
        host: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            bio: true,
            role: true,
            isHostVerified: true,
            createdAt: true,
          },
        },
        reviews: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
        blockedDates: true,
        bookings: {
          where: {
            status: { in: ["CONFIRMED", "CHECKED_IN"] },
            endDate: { gte: new Date() },
          },
          select: {
            startDate: true,
            endDate: true,
          },
        },
      },
    });

    if (!listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    return NextResponse.json({ listing });
  } catch (error: any) {
    console.error("GET /api/listings/[id] error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch listing" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();

    const updated = await prisma.listing.update({
      where: { id },
      data: body,
    });

    return NextResponse.json({ listing: updated });
  } catch (error: any) {
    console.error("PATCH /api/listings/[id] error:", error);
    return NextResponse.json({ error: error.message || "Failed to update listing" }, { status: 400 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    await prisma.listing.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("DELETE /api/listings/[id] error:", error);
    return NextResponse.json({ error: error.message || "Failed to delete listing" }, { status: 400 });
  }
}
