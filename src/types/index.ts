export type UserRole = "GUEST" | "HOST" | "ADMIN";

export interface UserProfile {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  bio?: string | null;
  phone?: string | null;
  role: UserRole;
  isHostVerified: boolean;
}

export interface ListingImageItem {
  id?: string;
  url: string;
  caption?: string | null;
  orderIndex: number;
}

export interface ListingAmenityItem {
  id?: string;
  amenityKey: string;
}

export interface ListingItem {
  id: string;
  hostId: string;
  host?: UserProfile;
  title: string;
  description: string;
  propertyType: string;
  roomType: string;
  category: string;
  address: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
  pricePerNight: number;
  weekendSurge: number;
  cleaningFee: number;
  serviceFee: number;
  maxGuests: number;
  bedrooms: number;
  beds: number;
  baths: number;
  isPublished: boolean;
  instantBookable: boolean;
  minNights: number;
  houseRules?: string | null;
  cancellationPolicy: "FLEXIBLE" | "MODERATE" | "STRICT" | string;
  rating: number;
  reviewCount: number;
  createdAt: Date | string;
  updatedAt: Date | string;
  images: ListingImageItem[];
  amenities: ListingAmenityItem[];
  reviews?: ReviewItem[];
  blockedDates?: { date: string | Date }[];
}

export interface BookingItem {
  id: string;
  listingId: string;
  listing?: ListingItem;
  guestId: string;
  guest?: UserProfile;
  startDate: string | Date;
  endDate: string | Date;
  nights: number;
  guestsCount: number;
  pricePerNight: number;
  cleaningFee: number;
  serviceFee: number;
  totalPrice: number;
  status: "PENDING" | "CONFIRMED" | "CHECKED_IN" | "COMPLETED" | "CANCELED";
  isInstant: boolean;
  stripePaymentId?: string | null;
  paymentStatus: "UNPAID" | "PENDING" | "PAID" | "REFUNDED";
  guestNote?: string | null;
  createdAt: string | Date;
}

export interface ReviewItem {
  id: string;
  listingId: string;
  authorId: string;
  author?: UserProfile;
  rating: number;
  cleanlinessRating: number;
  accuracyRating: number;
  communicationRating: number;
  locationRating: number;
  checkinRating: number;
  valueRating: number;
  comment: string;
  createdAt: string | Date;
}

export interface SearchFilters {
  location?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  propertyTypes?: string[];
  roomType?: string;
  guests?: number;
  bedrooms?: number;
  beds?: number;
  baths?: number;
  amenities?: string[];
  instantOnly?: boolean;
  checkIn?: string;
  checkOut?: string;
}
