"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Luggage, 
  Calendar, 
  MapPin, 
  ChevronRight, 
  X, 
  Receipt, 
  ShieldCheck, 
  Star,
  Loader2,
  CheckCircle2
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { BookingItem } from "@/types";
import { formatPrice, formatDateRange } from "@/lib/utils";
import { ReviewModal } from "@/components/ReviewModal";

export default function TripsPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedReceipt, setSelectedReceipt] = useState<BookingItem | null>(null);
  const [reviewBooking, setReviewBooking] = useState<BookingItem | null>(null);

  const fetchTrips = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/bookings?guestId=${user?.id || "guest_aarav"}`);
      const data = await res.json();
      if (res.ok) {
        setBookings(data.bookings || []);
      }
    } catch (e) {
      console.error("Failed to load guest trips", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, [user]);

  const handleCancelTrip = async (bookingId: string) => {
    if (!confirm("Are you sure you want to cancel this reservation?")) return;
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "CANCELED" }),
      });
      if (res.ok) {
        fetchTrips();
      }
    } catch (e) {
      console.error("Failed to cancel booking", e);
    }
  };

  const upcomingTrips = bookings.filter(
    (b) => b.status === "CONFIRMED" || b.status === "PENDING"
  );
  const pastTrips = bookings.filter(
    (b) => b.status === "COMPLETED" || b.status === "CHECKED_IN" || b.status === "CANCELED"
  );

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-8 py-10 space-y-10 animate-fade-in">
      <div className="space-y-2">
        <h1 className="text-3xl font-black tracking-tight text-neutral-900">
          My Trips & Reservations
        </h1>
        <p className="text-xs text-neutral-500">
          View your confirmed stays, check-in instructions, and payment receipts.
        </p>
      </div>

      {isLoading ? (
        <div className="h-64 flex flex-col items-center justify-center space-y-2">
          <Loader2 className="w-8 h-8 animate-spin text-neutral-800" />
          <span className="text-xs text-neutral-400">Loading your reservations...</span>
        </div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-20 bg-neutral-50 rounded-3xl border border-neutral-200 space-y-4">
          <div className="w-16 h-16 rounded-full bg-white border border-neutral-200 flex items-center justify-center mx-auto text-neutral-400">
            <Luggage className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-neutral-900">No trips booked... yet!</h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            Time to dust off your passport and explore minimalist architectural retreats around the world.
          </p>
          <Link
            href="/"
            className="inline-block bg-black text-white px-6 py-2.5 rounded-full text-xs font-bold hover:bg-neutral-800"
          >
            Start exploring
          </Link>
        </div>
      ) : (
        <div className="space-y-12">
          {/* Upcoming Reservations */}
          {upcomingTrips.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-base font-extrabold uppercase tracking-wider text-neutral-400">
                Upcoming Stays ({upcomingTrips.length})
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {upcomingTrips.map((booking) => (
                  <div
                    key={booking.id}
                    className="border border-neutral-200 rounded-3xl p-5 bg-white shadow-xs hover:shadow-md transition-shadow space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 mb-1">
                            {booking.status}
                          </span>
                          <h3 className="text-base font-bold text-neutral-900 leading-snug">
                            {booking.listing?.title}
                          </h3>
                          <p className="text-xs text-neutral-500 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                            {booking.listing?.city}, {booking.listing?.country}
                          </p>
                        </div>

                        <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 border border-neutral-200">
                          <img
                            src={booking.listing?.images?.[0]?.url || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80"}
                            alt={booking.listing?.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>

                      <div className="p-3 bg-neutral-50 rounded-2xl grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-neutral-400 block">
                            Dates
                          </span>
                          <span className="font-semibold text-neutral-800">
                            {formatDateRange(booking.startDate, booking.endDate)}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-bold text-neutral-400 block">
                            Total Paid
                          </span>
                          <span className="font-extrabold text-neutral-900">
                            {formatPrice(booking.totalPrice)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-neutral-100">
                      <button
                        onClick={() => setSelectedReceipt(booking)}
                        className="flex-1 text-xs font-bold py-2 rounded-xl border border-neutral-200 hover:bg-neutral-50 flex items-center justify-center gap-1.5"
                      >
                        <Receipt className="w-3.5 h-3.5 text-neutral-600" />
                        <span>Receipt</span>
                      </button>

                      <Link
                        href={`/rooms/${booking.listingId}`}
                        className="flex-1 text-xs font-bold py-2 rounded-xl bg-black text-white hover:bg-neutral-800 flex items-center justify-center gap-1.5"
                      >
                        <span>View Stay</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>

                      <button
                        onClick={() => handleCancelTrip(booking.id)}
                        className="text-xs font-semibold text-neutral-400 hover:text-red-600 px-3 py-2 rounded-xl border border-neutral-200 hover:bg-red-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Past / Completed Reservations */}
          {pastTrips.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-base font-extrabold uppercase tracking-wider text-neutral-400">
                Where You've Been ({pastTrips.length})
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pastTrips.map((booking) => (
                  <div
                    key={booking.id}
                    className="border border-neutral-200 rounded-2xl p-4 bg-white space-y-3 flex flex-col justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-neutral-200">
                        <img
                          src={booking.listing?.images?.[0]?.url || "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=400&q=80"}
                          alt={booking.listing?.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                            booking.status === "COMPLETED"
                              ? "bg-neutral-100 text-neutral-700"
                              : "bg-red-50 text-red-600"
                          }`}
                        >
                          {booking.status}
                        </span>
                        <h4 className="text-xs font-bold text-neutral-900 truncate mt-1">
                          {booking.listing?.title}
                        </h4>
                        <p className="text-[11px] text-neutral-500">
                          {formatDateRange(booking.startDate, booking.endDate)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-neutral-100">
                      <button
                        onClick={() => setSelectedReceipt(booking)}
                        className="flex-1 text-xs font-semibold py-1.5 rounded-lg border border-neutral-200 hover:bg-neutral-50 text-center"
                      >
                        Receipt
                      </button>
                      <button
                        onClick={() => setReviewBooking(booking)}
                        className="flex-1 text-xs font-bold py-1.5 rounded-lg bg-black text-white hover:bg-neutral-800 text-center"
                      >
                        Write Review
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Stripe Receipt Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div
            className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-neutral-200 space-y-5 animate-zoom-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-neutral-800" />
                <h3 className="text-sm font-black text-neutral-900">
                  ONLYSTAY Booking Receipt
                </h3>
              </div>
              <button
                onClick={() => setSelectedReceipt(null)}
                className="w-8 h-8 rounded-full hover:bg-neutral-100 flex items-center justify-center text-neutral-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1 text-xs">
              <p className="font-bold text-neutral-900">{selectedReceipt.listing?.title}</p>
              <p className="text-neutral-500">{selectedReceipt.listing?.address}</p>
              <p className="text-[11px] text-neutral-400">
                Confirmation ID: {selectedReceipt.id}
              </p>
              <p className="text-[11px] text-neutral-400">
                Stripe Ref: {selectedReceipt.stripePaymentId || "pi_live_stripe_mock"}
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-neutral-100 text-xs">
              <div className="flex justify-between text-neutral-600">
                <span>Room charge ({selectedReceipt.nights} nights)</span>
                <span>{formatPrice(selectedReceipt.pricePerNight * selectedReceipt.nights)}</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Cleaning fee</span>
                <span>{formatPrice(selectedReceipt.cleaningFee)}</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>ONLYSTAY service fee</span>
                <span>{formatPrice(selectedReceipt.serviceFee)}</span>
              </div>
              <div className="h-px bg-neutral-200 my-1" />
              <div className="flex justify-between text-sm font-black text-neutral-900">
                <span>Total Paid</span>
                <span>{formatPrice(selectedReceipt.totalPrice)}</span>
              </div>
            </div>

            <div className="p-3 bg-neutral-50 rounded-xl text-[11px] text-neutral-500 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Paid in full via UPI / Card ending in 4242</span>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {reviewBooking && (
        <ReviewModal
          isOpen={true}
          onClose={() => setReviewBooking(null)}
          listingId={reviewBooking.listingId}
          listingTitle={reviewBooking.listing?.title || "Stay"}
          onReviewSubmitted={fetchTrips}
        />
      )}
    </div>
  );
}
