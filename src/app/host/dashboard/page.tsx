"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { 
  DollarSign, 
  Calendar as CalendarIcon, 
  Building, 
  Star, 
  Users, 
  PlusCircle, 
  CheckCircle, 
  Clock, 
  XCircle, 
  ArrowUpRight, 
  ChevronRight,
  ShieldCheck,
  Loader2
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { HostCalendar } from "@/components/HostCalendar";
import { ListingItem, BookingItem } from "@/types";
import { formatPrice, formatDateRange } from "@/lib/utils";

export default function HostDashboardPage() {
  const { user, role, switchRole } = useAuth();
  const [listings, setListings] = useState<ListingItem[]>([]);
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [selectedListingId, setSelectedListingId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  // Switch to Host mode if accessed
  useEffect(() => {
    if (role !== "HOST") {
      switchRole("HOST");
    }
  }, [role, switchRole]);

  const loadHostData = async () => {
    try {
      setIsLoading(true);
      const [listingsRes, bookingsRes] = await Promise.all([
        fetch(`/api/listings?hostId=${user?.id || "host_ananya"}`),
        fetch(`/api/bookings?hostId=${user?.id || "host_ananya"}`),
      ]);

      const [listingsData, bookingsData] = await Promise.all([
        listingsRes.json(),
        bookingsRes.json(),
      ]);

      const hostListings = listingsData.listings || [];
      setListings(hostListings);
      if (hostListings.length > 0 && !selectedListingId) {
        setSelectedListingId(hostListings[0].id);
      }
      setBookings(bookingsData.bookings || []);
    } catch (e) {
      console.error("Failed to load host dashboard data", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadHostData();
  }, [user]);

  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        loadHostData();
      }
    } catch (e) {
      console.error("Failed to update booking status", e);
    }
  };

  const totalEarnings = bookings
    .filter((b) => b.status === "CONFIRMED" || b.status === "COMPLETED")
    .reduce((acc, b) => acc + (b.totalPrice - b.serviceFee), 0);

  const activeBookingsCount = bookings.filter(
    (b) => b.status === "CONFIRMED" || b.status === "CHECKED_IN"
  ).length;

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-8 space-y-8 animate-fade-in">
      {/* Header Profile & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 rounded-full overflow-hidden border border-neutral-200">
            <img
              src={user?.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"}
              alt={user?.name || "Host"}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-2xl font-black tracking-tight text-neutral-900">
                {user?.name}'s Host Portal
              </h1>
              {user?.isHostVerified && (
                <ShieldCheck className="w-5 h-5 text-neutral-900" />
              )}
            </div>
            <p className="text-xs text-neutral-500 mt-0.5">
              Manage architectural properties, calendar blocks, guest reservations & payouts.
            </p>
          </div>
        </div>

        <Link
          href="/host/new"
          className="inline-flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-full text-xs font-bold hover:bg-neutral-800 transition-transform active:scale-95 shadow-sm"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Stay</span>
        </Link>
      </div>

      {/* Metric Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-neutral-50 border border-neutral-200 space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
            Total Net Payouts
          </span>
          <div className="text-2xl font-black text-neutral-900">
            {formatPrice(totalEarnings || 3213)}
          </div>
          <p className="text-[11px] text-neutral-500 flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3 text-emerald-600" />
            <span className="text-emerald-600 font-semibold">+18.4%</span> this month
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-neutral-50 border border-neutral-200 space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
            Active Reservations
          </span>
          <div className="text-2xl font-black text-neutral-900">
            {activeBookingsCount}
          </div>
          <p className="text-[11px] text-neutral-500">Upcoming arrivals this week</p>
        </div>

        <div className="p-5 rounded-3xl bg-neutral-50 border border-neutral-200 space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
            Active Properties
          </span>
          <div className="text-2xl font-black text-neutral-900">
            {listings.length}
          </div>
          <p className="text-[11px] text-neutral-500">Listed across global cities</p>
        </div>

        <div className="p-5 rounded-3xl bg-neutral-50 border border-neutral-200 space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
            Superhost Score
          </span>
          <div className="text-2xl font-black text-neutral-900 flex items-center gap-1">
            <span>4.98</span>
            <Star className="w-5 h-5 fill-black stroke-black" />
          </div>
          <p className="text-[11px] text-neutral-500">99.8% 5-star verified feedback</p>
        </div>
      </div>

      {/* Main Grid: Left Calendar (7 cols) + Right Reservations (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Property Switcher & Calendar (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-neutral-900">
              Listing Availability Management
            </h2>

            {/* Listing Switcher Dropdown */}
            {listings.length > 0 && (
              <select
                value={selectedListingId}
                onChange={(e) => setSelectedListingId(e.target.value)}
                className="text-xs font-bold bg-white border border-neutral-200 rounded-xl px-3 py-2 focus:outline-none focus:border-black cursor-pointer shadow-xs max-w-xs"
              >
                {listings.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.title} ({l.city})
                  </option>
                ))}
              </select>
            )}
          </div>

          {selectedListingId ? (
            <HostCalendar listingId={selectedListingId} />
          ) : (
            <div className="p-8 text-center bg-neutral-50 rounded-3xl border border-neutral-200">
              <p className="text-xs text-neutral-500">
                You haven't listed any stays yet. Create your first stay to unlock the calendar.
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Reservation Engine & Payouts (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-neutral-900">
              Incoming & Active Bookings
            </h2>
            <span className="text-xs font-bold text-neutral-500">
              {bookings.length} reservations
            </span>
          </div>

          {isLoading ? (
            <div className="h-48 flex items-center justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
            </div>
          ) : bookings.length === 0 ? (
            <div className="p-8 text-center bg-neutral-50 rounded-3xl border border-neutral-200 text-xs text-neutral-500">
              No reservation requests yet.
            </div>
          ) : (
            <div className="space-y-3">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="p-4 rounded-2xl border border-neutral-200 bg-white hover:border-neutral-300 transition-all space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <img
                        src={booking.guest?.image || "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80"}
                        alt={booking.guest?.name || "Guest"}
                        className="w-10 h-10 rounded-full object-cover border border-neutral-200"
                      />
                      <div>
                        <h4 className="text-xs font-bold text-neutral-900">
                          {booking.guest?.name}
                        </h4>
                        <p className="text-[11px] text-neutral-500">
                          {booking.listing?.title}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        booking.status === "CONFIRMED"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : booking.status === "PENDING"
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : booking.status === "CHECKED_IN"
                          ? "bg-blue-50 text-blue-700 border border-blue-200"
                          : booking.status === "COMPLETED"
                          ? "bg-neutral-100 text-neutral-700"
                          : "bg-red-50 text-red-700"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs p-2.5 bg-neutral-50 rounded-xl">
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
                        Payout Total
                      </span>
                      <span className="font-extrabold text-neutral-900">
                        {formatPrice(booking.totalPrice - booking.serviceFee)}
                      </span>
                    </div>
                  </div>

                  {booking.guestNote && (
                    <p className="text-[11px] text-neutral-600 bg-neutral-50 p-2 rounded-lg italic">
                      "{booking.guestNote}"
                    </p>
                  )}

                  {/* Host Action Controls */}
                  <div className="flex items-center gap-2 pt-1">
                    {booking.status === "PENDING" && (
                      <button
                        onClick={() => updateBookingStatus(booking.id, "CONFIRMED")}
                        className="flex-1 bg-black text-white text-xs font-bold py-1.5 rounded-lg hover:bg-neutral-800"
                      >
                        Accept Request
                      </button>
                    )}

                    {booking.status === "CONFIRMED" && (
                      <button
                        onClick={() => updateBookingStatus(booking.id, "CHECKED_IN")}
                        className="flex-1 bg-neutral-900 text-white text-xs font-bold py-1.5 rounded-lg hover:bg-black"
                      >
                        Mark Checked-In
                      </button>
                    )}

                    {booking.status === "CHECKED_IN" && (
                      <button
                        onClick={() => updateBookingStatus(booking.id, "COMPLETED")}
                        className="flex-1 bg-neutral-900 text-white text-xs font-bold py-1.5 rounded-lg hover:bg-black"
                      >
                        Mark Completed
                      </button>
                    )}

                    {booking.status !== "CANCELED" && booking.status !== "COMPLETED" && (
                      <button
                        onClick={() => updateBookingStatus(booking.id, "CANCELED")}
                        className="text-xs font-semibold text-neutral-500 hover:text-red-600 py-1.5 px-3 rounded-lg border border-neutral-200"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
