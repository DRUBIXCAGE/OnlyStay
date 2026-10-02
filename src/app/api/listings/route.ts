import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ListingWizardSchema } from "@/lib/validations";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const location = searchParams.get("location")?.trim();
    const category = searchParams.get("category")?.trim();
    const minPrice = searchParams.get("minPrice") ? parseFloat(searchParams.get("minPrice")!) : undefined;
    const maxPrice = searchParams.get("maxPrice") ? parseFloat(searchParams.get("maxPrice")!) : undefined;
    const propertyTypes = searchParams.get("propertyTypes")?.split(",").filter(Boolean);
    const roomType = searchParams.get("roomType")?.trim();
    const guests = searchParams.get("guests") ? parseInt(searchParams.get("guests")!, 10) : undefined;
    const amenities = searchParams.get("amenities")?.split(",").filter(Boolean);
    const instantOnly = searchParams.get("instantOnly") === "true";
    const hostId = searchParams.get("hostId")?.trim();
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.max(1, parseInt(searchParams.get("limit") || "30", 10));
    const skip = (page - 1) * limit;

    const where: any = {
      isPublished: true,
    };

    if (hostId) {
      where.hostId = hostId;
      // Host can view all their listings, even unpublished
      delete where.isPublished;
    }

    if (location) {
      where.OR = [
        { city: { contains: location } },
        { country: { contains: location } },
        { address: { contains: location } },
        { title: { contains: location } },
      ];
    }

    if (category && category !== "All") {
      where.category = category;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.pricePerNight = {};
      if (minPrice !== undefined) where.pricePerNight.gte = minPrice;
      if (maxPrice !== undefined) where.pricePerNight.lte = maxPrice;
    }

    if (propertyTypes && propertyTypes.length > 0) {
      where.propertyType = { in: propertyTypes };
    }

    if (roomType && roomType !== "any") {
      where.roomType = roomType;
    }

    if (guests && guests > 1) {
      where.maxGuests = { gte: guests };
    }

    if (instantOnly) {
      where.instantBookable = true;
    }

    if (amenities && amenities.length > 0) {
      where.amenities = {
        some: {
          amenityKey: { in: amenities },
        },
      };
    }

    const [total, listings] = await Promise.all([
      prisma.listing.count({ where }),
      prisma.listing.findMany({
        where,
        include: {
          images: {
            orderBy: { orderIndex: "asc" },
          },
          amenities: true,
          host: {
            select: {
              id: true,
              name: true,
              image: true,
              role: true,
              isHostVerified: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
    ]);

    return NextResponse.json({
      listings,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error("GET /api/listings error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch listings" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = ListingWizardSchema.parse(body);
    const hostId = body.hostId || "host_ananya"; // fallback to default host if unauthenticated in preview

    const listing = await prisma.listing.create({
      data: {
        hostId,
        title: validatedData.title,
        description: validatedData.description,
        propertyType: validatedData.propertyType,
        roomType: validatedData.roomType,
        category: validatedData.category,
        address: validatedData.address,
        city: validatedData.city,
        country: validatedData.country,
        lat: validatedData.lat,
        lng: validatedData.lng,
        pricePerNight: validatedData.pricePerNight,
        weekendSurge: validatedData.weekendSurge,
        cleaningFee: validatedData.cleaningFee,
        serviceFee: Math.round(validatedData.pricePerNight * 0.1),
        maxGuests: validatedData.maxGuests,
        bedrooms: validatedData.bedrooms,
        beds: validatedData.beds,
        baths: validatedData.baths,
        houseRules: validatedData.houseRules,
        minNights: validatedData.minNights,
        cancellationPolicy: validatedData.cancellationPolicy,
        instantBookable: validatedData.instantBookable,
        isPublished: true,
        images: {
          create: validatedData.images.map((url, index) => ({
            url,
            orderIndex: index,
            caption: `${validatedData.title} photo ${index + 1}`,
          })),
        },
        amenities: {
          create: validatedData.amenities.map((key) => ({
            amenityKey: key,
          })),
        },
      },
      include: {
        images: true,
        amenities: true,
      },
    });

    return NextResponse.json({ listing }, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/listings error:", error);
    return NextResponse.json({ error: error.message || "Invalid listing data" }, { status: 400 });
  }
}
