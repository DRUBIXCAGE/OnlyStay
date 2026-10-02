import { z } from "zod";

export const ListingWizardSchema = z.object({
  category: z.string().min(1, "Please select a category"),
  propertyType: z.string().min(1, "Please select a stay type"),
  roomType: z.enum(["entire", "private", "shared"]),
  address: z.string().min(3, "Address is required"),
  city: z.string().min(2, "City is required"),
  country: z.string().min(2, "Country is required"),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  maxGuests: z.number().min(1, "At least 1 guest required"),
  bedrooms: z.number().min(0, "Bedrooms cannot be negative"),
  beds: z.number().min(1, "At least 1 bed required"),
  baths: z.number().min(0.5, "At least half a bath"),
  amenities: z.array(z.string()).min(1, "Select at least 1 amenity"),
  images: z.array(z.string().url("Must be valid image URL")).min(3, "Upload at least 3 photos"),
  title: z.string().min(8, "Title must be at least 8 characters").max(80, "Title too long"),
  description: z.string().min(25, "Description must be at least 25 characters"),
  houseRules: z.string().optional(),
  pricePerNight: z.number().min(10, "Minimum nightly rate is $10"),
  weekendSurge: z.number().min(0).default(0),
  cleaningFee: z.number().min(0).default(35),
  minNights: z.number().min(1).default(1),
  cancellationPolicy: z.enum(["FLEXIBLE", "MODERATE", "STRICT"]).default("FLEXIBLE"),
  instantBookable: z.boolean().default(true),
});

export type ListingWizardInput = z.infer<typeof ListingWizardSchema>;

export const BookingSchema = z.object({
  listingId: z.string().min(1, "Listing ID required"),
  guestId: z.string().min(1, "Guest ID required"),
  startDate: z.string().refine((d) => !isNaN(Date.parse(d)), "Invalid start date"),
  endDate: z.string().refine((d) => !isNaN(Date.parse(d)), "Invalid end date"),
  guestsCount: z.number().min(1, "At least 1 guest"),
  pricePerNight: z.number().positive(),
  cleaningFee: z.number().min(0),
  serviceFee: z.number().min(0),
  totalPrice: z.number().positive(),
  isInstant: z.boolean().default(true),
  guestNote: z.string().optional(),
  stripePaymentId: z.string().optional(),
});

export type BookingInput = z.infer<typeof BookingSchema>;

export const SearchQuerySchema = z.object({
  location: z.string().optional(),
  category: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  propertyTypes: z.string().optional(),
  roomType: z.string().optional(),
  guests: z.coerce.number().optional(),
  amenities: z.string().optional(),
  instantOnly: z.coerce.boolean().optional(),
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(24),
});

export const ReviewSchema = z.object({
  listingId: z.string().min(1),
  authorId: z.string().min(1),
  rating: z.number().min(1).max(5),
  cleanlinessRating: z.number().min(1).max(5).default(5),
  accuracyRating: z.number().min(1).max(5).default(5),
  communicationRating: z.number().min(1).max(5).default(5),
  locationRating: z.number().min(1).max(5).default(5),
  checkinRating: z.number().min(1).max(5).default(5),
  valueRating: z.number().min(1).max(5).default(5),
  comment: z.string().min(10, "Review must be at least 10 characters"),
});
