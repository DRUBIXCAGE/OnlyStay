import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ReviewSchema } from "@/lib/validations";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = ReviewSchema.parse(body);

    const review = await prisma.review.create({
      data: {
        listingId: validated.listingId,
        authorId: validated.authorId,
        rating: validated.rating,
        cleanlinessRating: validated.cleanlinessRating,
        accuracyRating: validated.accuracyRating,
        communicationRating: validated.communicationRating,
        locationRating: validated.locationRating,
        checkinRating: validated.checkinRating,
        valueRating: validated.valueRating,
        comment: validated.comment,
      },
      include: {
        author: {
          select: { name: true, image: true },
        },
      },
    });

    // Recalculate listing rating
    const aggregates = await prisma.review.aggregate({
      where: { listingId: validated.listingId },
      _avg: { rating: true },
      _count: { id: true },
    });

    await prisma.listing.update({
      where: { id: validated.listingId },
      data: {
        rating: Math.round((aggregates._avg.rating || 5) * 100) / 100,
        reviewCount: aggregates._count.id,
      },
    });

    return NextResponse.json({ review }, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/reviews error:", error);
    return NextResponse.json({ error: error.message || "Failed to submit review" }, { status: 400 });
  }
}
