"use client";

import React, { useState } from "react";
import { X, Search, MapPin, Calendar as CalendarIcon, Users, Plus, Minus, Check } from "lucide-react";
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
  const [dateSelection, setDateSelection] = useState<string>(
    filters.checkIn ? "Selected Stay Dates" : ""
  );
  const [checkIn, setCheckIn] = useState(filters.checkIn || "");
  const [checkOut, setCheckOut] = useState(filters.checkOut || "");
  const [guests, setGuests] = useState(filters.guests || 1);

  if (!isSearchModalOpen) return null;

  const handleQuickDate = (label: string, startDays: number, nights: number) => {
    const start = new Date();
    start.setDate(start.getDate() + startDays);
    const end = new Date(start);
    end.setDate(end.getDate() + nights);

    setCheckIn(start.toISOString().split("T")[0]);
    setCheckOut(end.toISOString().split("T")[0]);
    setDateSelection(label);
  };

  const handleSingleDateInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (!val) {
      setCheckIn("");
      setCheckOut("");
      setDateSelection("");
      return;
    }
    const start = new Date(val);
    const end = new Date(start);
    end.setDate(end.getDate() + 3);

    const startStr = start.toISOString().split("T")[0];
    const endStr = end.toISOString().split("T")[0];

    setCheckIn(startStr);
    setCheckOut(endStr);
    setDateSelection(`${start.toLocaleDateString("en-IN", { month: "short", day: "numeric" })} (3 nights)`);
  };

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
    setDateSelection("");
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
        className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden animate-zoom-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-neutral-100">
          <div>
            <h2 className="text-base font-bold text-neutral-900">
              Easy Search
            </h2>
            <p className="text-xs text-neutral-500">
              Pick destination and single-option dates.
            </p>
          </div>
          <button
            onClick={closeSearchModal}
            className="w-8 h-8 rounded-full hover:bg-neutral-100 flex items-center justify-center text-neutral-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          {/* Destination Section */}
          <div className="space-y-3">
            <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-neutral-900" />
              <span>Where to?</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Search city (e.g. Goa, Udaipur, Manali)..."
                className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-black transition-all"
              />
              {destination && (
                <button
                  onClick={() => setDestination("")}
                  className="absolute right-3 top-2.5 text-neutral-400 hover:text-neutral-700"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Quick destination chips */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {POPULAR_DESTINATIONS.slice(0, 6).map((dest) => (
                <button
                  key={dest.city}
                  onClick={() => setDestination(dest.city)}
                  className={`text-xs px-2.5 py-1 rounded-full border transition-all text-left ${
                    destination.toLowerCase() === dest.city.toLowerCase()
                      ? "bg-black text-white border-black font-semibold"
                      : "bg-white text-neutral-700 border-neutral-200 hover:border-black"
                  }`}
                >
                  {dest.city}
                </button>
              ))}
            </div>
          </div>

          {/* Date Selection: In ONE OPTION ONLY */}
          <div className="space-y-3 pt-3 border-t border-neutral-100">
            <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-1.5">
              <CalendarIcon className="w-3.5 h-3.5 text-neutral-900" />
              <span>When (Select in 1 Option)</span>
            </label>

            {/* 1-Click Single Date Option Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDate("This Weekend", 2, 2)}
                className={`p-3 rounded-xl border text-xs font-semibold text-left flex items-center justify-between transition-all ${
                  dateSelection === "This Weekend"
                    ? "border-black bg-black text-white"
                    : "border-neutral-200 hover:border-black"
                }`}
              >
                <span>This Weekend</span>
                <span className="text-[10px] opacity-70">2 nights</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDate("Next Weekend", 9, 3)}
                className={`p-3 rounded-xl border text-xs font-semibold text-left flex items-center justify-between transition-all ${
                  dateSelection === "Next Weekend"
                    ? "border-black bg-black text-white"
                    : "border-neutral-200 hover:border-black"
                }`}
              >
                <span>Next Weekend</span>
                <span className="text-[10px] opacity-70">3 nights</span>
              </button>
            </div>

            {/* Single Date Calendar Picker */}
            <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200/80">
              <span className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">
                Or Pick Date (Single Input):
              </span>
              <input
                type="date"
                min={new Date().toISOString().split("T")[0]}
                onChange={handleSingleDateInput}
                className="w-full text-xs font-semibold p-2 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:border-black"
              />
            </div>
          </div>

          {/* Guests Section */}
          <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
            <div>
              <p className="text-xs font-bold text-neutral-900">Total Guests</p>
              <p className="text-[11px] text-neutral-400">Adults and children</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                disabled={guests <= 1}
                onClick={() => setGuests(Math.max(1, guests - 1))}
                className="w-7 h-7 rounded-full border border-neutral-300 flex items-center justify-center disabled:opacity-30"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="text-xs font-bold w-4 text-center">{guests}</span>
              <button
                disabled={guests >= 10}
                onClick={() => setGuests(guests + 1)}
                className="w-7 h-7 rounded-full border border-neutral-300 flex items-center justify-center"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-neutral-50 border-t border-neutral-100 flex items-center justify-between">
          <button
            onClick={handleClear}
            className="text-xs font-semibold text-neutral-500 hover:text-neutral-900 underline"
          >
            Clear
          </button>
          <button
            onClick={handleSearch}
            className="bg-black text-white px-6 py-2.5 rounded-full text-xs font-bold hover:bg-neutral-800 transition-all flex items-center gap-2 active:scale-95"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search stays</span>
          </button>
        </div>
      </div>
    </div>
  );
}
