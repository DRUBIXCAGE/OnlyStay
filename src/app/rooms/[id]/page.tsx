"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Star, 
  MapPin, 
  Share2, 
  Heart, 
  ShieldCheck, 
  Wifi, 
  Laptop, 
  ChefHat, 
  Wind, 
  Waves, 
  Flame, 
  Car, 
  Sparkles, 
  Clock, 
  Calendar,
  MessageSquare,
  ChevronLeft,
  Loader2
} from "lucide-react";
import { PhotoMosaic } from "@/components/PhotoMosaic";
import { BookingCard } from "@/components/BookingCard";
import { InteractiveMap } from "@/components/InteractiveMap";
import { ReviewModal } from "@/components/ReviewModal";
import { ListingItem } from "@/types";
import { formatPrice } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";

const AMENITY_ICONS: { [key: string]: { label: string; icon: any } } = {
  wifi: { label: "High-speed Wi-Fi (500+ Mbps)", icon: Wifi },
  workspace: { label: "Dedicated ergonomic workspace", icon: Laptop },
  kitchen: { label: "Fully equipped gourmet kitchen", icon: ChefHat },
  ac: { label: "Climate control / Air conditioning", icon: Wind },
  pool: { label: "Private architectural pool", icon: Waves },
  hot_tub: { label: "Hinoki cedar hot tub / bath", icon: Sparkles },
  washer: { label: "In-unit washer & dryer", icon: Sparkles },
  fireplace: { label: "Minimalist gas fireplace", icon: Flame },
  ev_charger: { label: "EV charging station (Level 2)", icon: Car },
  parking: { label: "Free on-premise private parking", icon: Car },
  ocean_view: { label: "Panoramic ocean vista", icon: Waves },
  mountain_view: { label: "Dramatic mountain landscape", icon: Sparkles },
  balcony: { label: "Private cantilevered terrace", icon: Sparkles },
};

export default function RoomDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const id = params?.id as string;

  const [listing, setListing] = useState<ListingItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const fetchListing = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/listings/${id}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Stay not found");
      }
      setListing(data.listing);
    } catch (e: any) {
      setError(e.message || "Failed to load stay");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchListing();
    }
  }, [id]);

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-[70vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-neutral-800" />
        <span className="text-xs font-semibold text-neutral-500">
          Loading architectural space...
        </span>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="max-w-2xl mx-auto py-24 px-4 text-center space-y-4">
        <h2 className="text-xl font-bold text-neutral-900">Stay Not Found</h2>
        <p className="text-xs text-neutral-500">{error || "The requested stay is unavailable."}</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-full text-xs font-bold"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Discovery</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1360px] mx-auto px-4 sm:px-8 py-8 space-y-8 animate-fade-in">
      {/* Title & Top Action Bar */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900">
            {listing.title}
          </h1>

          <div className="flex items-center gap-3 text-xs font-semibold text-neutral-700">
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-neutral-200 hover:bg-neutral-100 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{isCopied ? "Link Copied!" : "Share"}</span>
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-neutral-200 hover:bg-neutral-100 transition-colors">
              <Heart className="w-3.5 h-3.5" />
              <span>Save</span>
            </button>
          </div>
        </div>

        {/* Location & Rating meta */}
        <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-neutral-600">
          <div className="flex items-center gap-1 font-bold text-neutral-900">
            <Star className="w-4 h-4 fill-black stroke-black" />
            <span>{listing.rating.toFixed(2)}</span>
            <span className="text-neutral-400 font-normal">
              · {listing.reviewCount} reviews
            </span>
          </div>
          <span>·</span>
          <div className="flex items-center gap-1 text-neutral-800">
            <MapPin className="w-3.5 h-3.5 text-neutral-500" />
            <span className="underline">{listing.address}, {listing.city}, {listing.country}</span>
          </div>
          <span>·</span>
          <span className="font-semibold text-neutral-800 px-2 py-0.5 bg-neutral-100 rounded-md">
            {listing.category} Sanctuary
          </span>
        </div>
      </div>

      {/* Photo Gallery Mosaic & Lightbox */}
      <PhotoMosaic images={listing.images} title={listing.title} />

      {/* Content Layout: Left details (7 cols) + Right sticky booking (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start pt-4">
        {/* Left Column (7 cols) */}
        <div className="lg:col-span-7 xl:col-span-7 space-y-8">
          {/* Host header info */}
          <div className="flex items-center justify-between pb-6 border-b border-neutral-200">
            <div>
              <h2 className="text-lg font-bold text-neutral-900">
                {listing.propertyType} hosted by {listing.host?.name || "Marcus Sterling"}
              </h2>
              <p className="text-xs text-neutral-500 mt-1">
                {listing.maxGuests} guests · {listing.bedrooms} bedroom{listing.bedrooms > 1 ? "s" : ""} · {listing.beds} bed{listing.beds > 1 ? "s" : ""} · {listing.baths} bath{listing.baths > 1 ? "s" : ""}
              </p>
            </div>
            <div className="relative w-14 h-14 rounded-full overflow-hidden border border-neutral-200 shrink-0">
              <img
                src={listing.host?.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"}
                alt={listing.host?.name || "Host"}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Highlights */}
          <div className="space-y-4 pb-6 border-b border-neutral-200 text-xs">
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-neutral-800 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-neutral-900">Experienced Design Host</p>
                <p className="text-neutral-500">
                  {listing.host?.name} has a 98% 5-star rating for architectural stewardship.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-neutral-800 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-neutral-900">Effortless Self Check-in</p>
                <p className="text-neutral-500">
                  Keyless smart entry instructions provided 24 hours prior to arrival.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-neutral-800 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-neutral-900">{listing.cancellationPolicy} Cancellation</p>
                <p className="text-neutral-500">
                  Full refund if canceled up to 48 hours prior to reservation check-in date.
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3 pb-6 border-b border-neutral-200">
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-400">
              About the space
            </h3>
            <p className="text-sm text-neutral-700 leading-relaxed font-normal whitespace-pre-line">
              {listing.description}
            </p>
          </div>

          {/* Amenities */}
          <div className="space-y-4 pb-6 border-b border-neutral-200">
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-400">
              What this place offers
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {listing.amenities?.map((amenity) => {
                const config = AMENITY_ICONS[amenity.amenityKey] || {
                  label: amenity.amenityKey.replace("_", " "),
                  icon: Sparkles,
                };
                const Icon = config.icon;
                return (
                  <div
                    key={amenity.amenityKey}
                    className="flex items-center gap-3 p-3 rounded-xl border border-neutral-100 bg-neutral-50/60 text-xs font-semibold text-neutral-800"
                  >
                    <Icon className="w-4 h-4 text-neutral-700" />
                    <span>{config.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Location Map */}
          <div className="space-y-3 pb-6 border-b border-neutral-200">
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-400">
              Location & Neighborhood
            </h3>
            <p className="text-xs text-neutral-600 mb-2">
              {listing.address}, {listing.city}, {listing.country} — Exact coordinates provided upon booking confirmation.
            </p>
            <div className="h-72 w-full rounded-2xl overflow-hidden border border-neutral-200">
              <InteractiveMap listings={[listing]} />
            </div>
          </div>

          {/* Host Bio Card */}
          <div className="p-6 rounded-3xl bg-neutral-50 border border-neutral-200 space-y-4">
            <div className="flex items-center gap-4">
              <img
                src={listing.host?.image || ""}
                alt={listing.host?.name || "Host"}
                className="w-14 h-14 rounded-full object-cover border border-neutral-200"
              />
              <div>
                <h4 className="text-sm font-bold text-neutral-900">
                  Hosted by {listing.host?.name}
                </h4>
                <p className="text-xs text-neutral-500">
                  Verified Host · Joined ONLYSTAY in 2024
                </p>
              </div>
            </div>
            {listing.host?.bio && (
              <p className="text-xs text-neutral-600 leading-relaxed">
                "{listing.host.bio}"
              </p>
            )}
            <div className="pt-2 flex items-center gap-6 text-xs text-neutral-700">
              <div>
                <span className="font-bold text-neutral-900">Response rate:</span> 100%
              </div>
              <div>
                <span className="font-bold text-neutral-900">Response time:</span> Within an hour
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="space-y-6 pt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 fill-black stroke-black" />
                <h3 className="text-lg font-extrabold text-neutral-900">
                  {listing.rating.toFixed(2)} · {listing.reviewCount} Reviews
                </h3>
              </div>
              <button
                onClick={() => setIsReviewModalOpen(true)}
                className="text-xs font-bold px-4 py-2 rounded-full border border-neutral-200 hover:bg-neutral-100 transition-colors"
              >
                Write a Review
              </button>
            </div>

            {/* Ratings breakdown */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-neutral-50 text-xs">
              <div>
                <span className="text-neutral-500 block text-[11px]">Cleanliness</span>
                <span className="font-bold text-sm text-neutral-900">5.0 ★</span>
              </div>
              <div>
                <span className="text-neutral-500 block text-[11px]">Accuracy</span>
                <span className="font-bold text-sm text-neutral-900">5.0 ★</span>
              </div>
              <div>
                <span className="text-neutral-500 block text-[11px]">Communication</span>
                <span className="font-bold text-sm text-neutral-900">4.9 ★</span>
              </div>
              <div>
                <span className="text-neutral-500 block text-[11px]">Location</span>
                <span className="font-bold text-sm text-neutral-900">5.0 ★</span>
              </div>
              <div>
                <span className="text-neutral-500 block text-[11px]">Check-in</span>
                <span className="font-bold text-sm text-neutral-900">5.0 ★</span>
              </div>
              <div>
                <span className="text-neutral-500 block text-[11px]">Value</span>
                <span className="font-bold text-sm text-neutral-900">4.9 ★</span>
              </div>
            </div>

            {/* Individual Reviews Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {listing.reviews && listing.reviews.length > 0 ? (
                listing.reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-4 rounded-2xl border border-neutral-100 bg-white space-y-2 shadow-xs"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={rev.author?.image || "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80"}
                        alt={rev.author?.name || "Author"}
                        className="w-9 h-9 rounded-full object-cover border border-neutral-200"
                      />
                      <div>
                        <p className="text-xs font-bold text-neutral-900">
                          {rev.author?.name || "Verified Traveler"}
                        </p>
                        <div className="flex items-center gap-1 text-[10px] text-neutral-400">
                          <span>{new Date(rev.createdAt).toLocaleDateString()}</span>
                          <span>·</span>
                          <span className="font-semibold text-neutral-800">
                            {rev.rating.toFixed(1)} ★
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-neutral-600 leading-relaxed font-normal">
                      "{rev.comment}"
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-neutral-400 col-span-2 py-4">
                  No verified reviews yet. Be the first guest to review this stay!
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column Sticky Booking Checkout Card (5 cols) */}
        <div className="lg:col-span-5 xl:col-span-5">
          <BookingCard listing={listing} />
        </div>
      </div>

      {/* Review Modal */}
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        listingId={listing.id}
        listingTitle={listing.title}
        onReviewSubmitted={fetchListing}
      />
    </div>
  );
}
