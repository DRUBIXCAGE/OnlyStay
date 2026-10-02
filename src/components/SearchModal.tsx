"use client";

import React, { useState } from "react";
import { X, Search, MapPin, Calendar as CalendarIcon, Users, Plus, Minus } from "lucide-react";
import { useUIStore } from "@/lib/store";

const POPULAR_DESTINATIONS = [
  { city: "Goa", country: "India", desc: "Portuguese heritage & coastal retreats" },
  { city: "Udaipur", country: "India", desc: "Lake Pichola palatial havelis" },
  { city: "Jaipur", country: "India", desc: "Pink City sandstone architecture" },
  { city: "Manali", country: "India", desc: "Himalayan pine & cedar chalets" },
  { city: "Kerala", country: "India", desc: "Alleppey backwaters & teak villas" },
  { city: "Pondicherry", country: "India", desc: "French colonial boulevards & courtyards" },
  { city: "Rishikesh", country: "India", desc: "Ganges riverfront serenity" },
  { city: "Coorg", country: "India", desc: "Mist-laden coffee estate bungalows" },
  { city: "Alibaug", country: "India", desc: "Coastal brutalist pavilions" },
  { city: "Ladakh", country: "India", desc: "Nubra valley eco-stone sanctuaries" },
];

export function SearchModal() {
  const { isSearchModalOpen, closeSearchModal, filters, setFilters } = useUIStore();
  
  const [destination, setDestination] = useState(filters.location || "");
  const [checkIn, setCheckIn] = useState(filters.checkIn || "");
  const [checkOut, setCheckOut] = useState(filters.checkOut || "");
  const [guests, setGuests] = useState(filters.guests || 1);

  if (!isSearchModalOpen) return null;

  const handleSearch = () => {
    setFilters({
      location: destination.trim(),
      checkIn: checkIn || undefined,
      checkOut: checkOut || undefined,
      guests: guests > 0 ? guests : 1,
    });
    closeSearchModal();
  };

  const handleClear = () => {
    setDestination("");
    setCheckIn("");
    setCheckOut("");
    setGuests(1);
    setFilters({
      location: "",
      checkIn: undefined,
      checkOut: undefined,
      guests: 1,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden animate-zoom-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-100">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-neutral-900">
              Where to next?
            </h2>
            <p className="text-xs text-neutral-500">
              Discover curated minimalist sanctuaries worldwide.
            </p>
          </div>
          <button
            onClick={closeSearchModal}
            className="w-9 h-9 rounded-full hover:bg-neutral-100 flex items-center justify-center text-neutral-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          {/* Destination Section */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-600 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-neutral-900" />
              <span>Destination</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Search city, neighborhood, or country..."
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-all"
              />
              {destination && (
                <button
                  onClick={() => setDestination("")}
                  className="absolute right-3 top-3 text-neutral-400 hover:text-neutral-700"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Popular destination quick chips */}
            <div className="pt-2">
              <p className="text-[11px] font-medium text-neutral-400 mb-2">
                Popular architectural hubs:
              </p>
              <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto no-scrollbar">
                {POPULAR_DESTINATIONS.map((dest) => (
                  <button
                    key={dest.city}
                    onClick={() => setDestination(dest.city)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-all text-left ${
                      destination.toLowerCase() === dest.city.toLowerCase()
                        ? "bg-black text-white border-black font-semibold"
                        : "bg-white text-neutral-700 border-neutral-200 hover:border-neutral-400"
                    }`}
                  >
                    <span>{dest.city}</span>
                    <span className="text-[10px] ml-1 opacity-60">· {dest.country}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Dates & Guests Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-neutral-100">
            {/* Dates */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-600 flex items-center gap-1.5">
                <CalendarIcon className="w-4 h-4 text-neutral-900" />
                <span>When</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] font-semibold text-neutral-400 block mb-1">Check in</span>
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full text-xs p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-neutral-400 block mb-1">Check out</span>
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full text-xs p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>
              </div>
            </div>

            {/* Guests Stepper */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-600 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-neutral-900" />
                <span>Who</span>
              </label>
              <div className="flex items-center justify-between p-3 bg-neutral-50 border border-neutral-200 rounded-xl">
                <div>
                  <p className="text-xs font-bold text-neutral-900">Total Guests</p>
                  <p className="text-[11px] text-neutral-500">Ages 13 or above</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    disabled={guests <= 1}
                    onClick={() => setGuests(Math.max(1, guests - 1))}
                    className="w-7 h-7 rounded-full border border-neutral-300 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:bg-neutral-200 transition-colors"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-sm font-bold w-4 text-center">{guests}</span>
                  <button
                    disabled={guests >= 16}
                    onClick={() => setGuests(guests + 1)}
                    className="w-7 h-7 rounded-full border border-neutral-300 flex items-center justify-center hover:bg-neutral-200 transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-6 bg-neutral-50 border-t border-neutral-100 flex items-center justify-between">
          <button
            onClick={handleClear}
            className="text-xs font-semibold text-neutral-500 hover:text-neutral-900 underline transition-colors"
          >
            Clear all
          </button>
          <button
            onClick={handleSearch}
            className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full text-xs font-bold hover:bg-neutral-800 transition-transform active:scale-95 shadow-md"
          >
            <Search className="w-4 h-4" />
            <span>Search stays</span>
          </button>
        </div>
      </div>
    </div>
  );
}
