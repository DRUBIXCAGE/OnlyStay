"use client";

import React, { useState } from "react";
import { Star, ShieldCheck, Zap, AlertCircle, ChevronDown } from "lucide-react";
import { ListingItem } from "@/types";
import { formatPrice, calculateNights } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import { StripePaymentModal } from "./StripePaymentModal";

interface BookingCardProps {
  listing: ListingItem;
}

export function BookingCard({ listing }: BookingCardProps) {
  const { user } = useAuth();

  // Initialize dates: tomorrow & +4 days
  const today = new Date();
  const defaultCheckIn = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2)
    .toISOString()
    .split("T")[0];
  const defaultCheckOut = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 6)
    .toISOString()
    .split("T")[0];

  const [checkIn, setCheckIn] = useState(defaultCheckIn);
  const [checkOut, setCheckOut] = useState(defaultCheckOut);
  const [guestsCount, setGuestsCount] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const nights = calculateNights(checkIn, checkOut);
  const basePrice = listing.pricePerNight * nights;
  const cleaningFee = listing.cleaningFee || 45;
  const serviceFee = listing.serviceFee || Math.round(basePrice * 0.1);
  const totalPrice = basePrice + cleaningFee + serviceFee;

  const isBlocked = false; // validated dynamically in payment modal & backend

  return (
    <>
      <div className="sticky top-28 w-full bg-white rounded-3xl border border-neutral-200 shadow-xl p-6 space-y-6">
        {/* Header Price & Rating */}
        <div className="flex items-baseline justify-between">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black tracking-tight text-neutral-900">
              {formatPrice(listing.pricePerNight)}
            </span>
            <span className="text-sm font-medium text-neutral-500">/ night</span>
          </div>

          <div className="flex items-center gap-1 text-xs font-bold text-neutral-900">
            <Star className="w-3.5 h-3.5 fill-black stroke-black" />
            <span>{listing.rating.toFixed(2)}</span>
            <span className="text-neutral-400 font-normal">
              ({listing.reviewCount})
            </span>
          </div>
        </div>

        {/* Date & Guest Input Box */}
        <div className="border border-neutral-200 rounded-2xl overflow-hidden divide-y divide-neutral-200">
          <div className="grid grid-cols-2 divide-x divide-neutral-200">
            <div className="p-3 bg-neutral-50/50 hover:bg-neutral-50 transition-colors">
              <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-500 block mb-0.5">
                Check-in
              </label>
              <input
                type="date"
                value={checkIn}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full text-xs font-semibold bg-transparent focus:outline-none cursor-pointer"
              />
            </div>
            <div className="p-3 bg-neutral-50/50 hover:bg-neutral-50 transition-colors">
              <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-500 block mb-0.5">
                Checkout
              </label>
              <input
                type="date"
                value={checkOut}
                min={checkIn}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full text-xs font-semibold bg-transparent focus:outline-none cursor-pointer"
              />
            </div>
          </div>

          {/* Guest Count Stepper */}
          <div className="p-3 bg-neutral-50/50 flex items-center justify-between">
            <div>
              <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-500 block">
                Guests
              </label>
              <span className="text-xs font-semibold text-neutral-800">
                {guestsCount} guest{guestsCount > 1 ? "s" : ""}
              </span>
            </div>
            <select
              value={guestsCount}
              onChange={(e) => setGuestsCount(parseInt(e.target.value, 10))}
              className="text-xs font-semibold bg-white border border-neutral-200 rounded-lg px-2 py-1 focus:outline-none cursor-pointer"
            >
              {Array.from({ length: listing.maxGuests || 4 }).map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1} guest{i > 0 ? "s" : ""}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full bg-black text-white py-3.5 rounded-2xl text-sm font-bold hover:bg-neutral-800 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-md"
        >
          {listing.instantBookable ? (
            <>
              <Zap className="w-4 h-4 fill-white" />
              <span>Instant Book</span>
            </>
          ) : (
            <span>Request to Book</span>
          )}
        </button>

        <p className="text-center text-[11px] text-neutral-400 font-medium">
          You won't be charged until dates are verified
        </p>

        {/* Pricing Breakdown */}
        <div className="space-y-3 pt-3 border-t border-neutral-100 text-xs">
          <div className="flex items-center justify-between text-neutral-600">
            <span>
              {formatPrice(listing.pricePerNight)} × {nights} nights
            </span>
            <span className="font-semibold text-neutral-900">
              {formatPrice(basePrice)}
            </span>
          </div>

          <div className="flex items-center justify-between text-neutral-600">
            <span className="underline decoration-neutral-300">Cleaning fee</span>
            <span className="font-semibold text-neutral-900">
              {formatPrice(cleaningFee)}
            </span>
          </div>

          <div className="flex items-center justify-between text-neutral-600">
            <span className="underline decoration-neutral-300">ONLYSTAY service fee</span>
            <span className="font-semibold text-neutral-900">
              {formatPrice(serviceFee)}
            </span>
          </div>

          <div className="h-px bg-neutral-200 my-2" />

          <div className="flex items-center justify-between text-sm font-extrabold text-neutral-900 pt-1">
            <span>Total before taxes</span>
            <span>{formatPrice(totalPrice)}</span>
          </div>
        </div>

        {/* Cancellation Badge */}
        <div className="pt-2 flex items-start gap-2.5 p-3 rounded-2xl bg-neutral-50 text-[11px] text-neutral-600 border border-neutral-200/60">
          <ShieldCheck className="w-4 h-4 text-neutral-800 shrink-0 mt-0.5" />
          <span>
            <strong className="font-semibold text-neutral-900">
              {listing.cancellationPolicy} Cancellation
            </strong>
            : Cancel up to 48 hours before check-in for a full refund.
          </span>
        </div>
      </div>

      {/* Stripe Payment Modal */}
      <StripePaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        listing={listing}
        startDate={checkIn}
        endDate={checkOut}
        nights={nights}
        guestsCount={guestsCount}
        totalPrice={totalPrice}
        guestId={user?.id || "guest_aarav"}
        onSuccess={() => setIsModalOpen(false)}
      />
    </>
  );
}
