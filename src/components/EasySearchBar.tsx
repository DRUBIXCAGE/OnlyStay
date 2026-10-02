"use client";

import React, { useState } from "react";
import { Search, MapPin, Calendar, Users, X, ChevronDown, Check } from "lucide-react";
import { useUIStore } from "@/lib/store";

const POPULAR_DESTINATIONS = [
  "Goa",
  "Udaipur",
  "Jaipur",
  "Manali",
  "Kerala",
  "Pondicherry",
  "Rishikesh",
  "Coorg",
  "Alibaug",
  "Ladakh",
];

export function EasySearchBar() {
  const { filters, setFilters } = useUIStore();
  const [location, setLocation] = useState(filters.location || "");
  const [selectedDates, setSelectedDates] = useState<string>(
    filters.checkIn && filters.checkOut
      ? `${filters.checkIn} to ${filters.checkOut}`
      : ""
  );
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [guests, setGuests] = useState(filters.guests || 1);
  const [isGuestOpen, setIsGuestOpen] = useState(false);
  const [isLocDropdownOpen, setIsLocDropdownOpen] = useState(false);

  // Quick single date presets
  const setQuickDate = (label: string, startOffset: number, duration: number) => {
    const start = new Date();
    start.setDate(start.getDate() + startOffset);
    const end = new Date(start);
    end.setDate(end.getDate() + duration);

    const startStr = start.toISOString().split("T")[0];
    const endStr = end.toISOString().split("T")[0];

    setSelectedDates(`${start.toLocaleDateString("en-IN", { month: "short", day: "numeric" })} – ${end.toLocaleDateString("en-IN", { month: "short", day: "numeric" })} (${duration} nights)`);
    setFilters({
      checkIn: startStr,
      checkOut: endStr,
    });
    setIsDatePickerOpen(false);
  };

  const handleCustomDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (!val) {
      setSelectedDates("");
      setFilters({ checkIn: undefined, checkOut: undefined });
      return;
    }
    // Set 3-night stay automatically from single selected date
    const start = new Date(val);
    const end = new Date(start);
    end.setDate(end.getDate() + 3);

    const startStr = start.toISOString().split("T")[0];
    const endStr = end.toISOString().split("T")[0];

    setSelectedDates(`${start.toLocaleDateString("en-IN", { month: "short", day: "numeric" })} – ${end.toLocaleDateString("en-IN", { month: "short", day: "numeric" })} (3 nights)`);
    setFilters({
      checkIn: startStr,
      checkOut: endStr,
    });
    setIsDatePickerOpen(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters({
      location: location.trim(),
      guests,
    });
    setIsDatePickerOpen(false);
    setIsGuestOpen(false);
    setIsLocDropdownOpen(false);
  };

  const handleClearLocation = () => {
    setLocation("");
    setFilters({ location: "" });
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-4 px-2">
      <form
        onSubmit={handleSearch}
        className="bg-white border border-neutral-300 rounded-2xl sm:rounded-full shadow-lg hover:shadow-xl transition-all p-2 flex flex-col sm:flex-row items-stretch sm:items-center divide-y sm:divide-y-0 sm:divide-x divide-neutral-200"
      >
        {/* 1. Destination Input */}
        <div className="relative flex-1 px-4 py-2 hover:bg-neutral-50 rounded-xl sm:rounded-full transition-colors group">
          <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block">
            Where
          </label>
          <div className="flex items-center gap-1.5 mt-0.5">
            <MapPin className="w-3.5 h-3.5 text-neutral-400 group-hover:text-black shrink-0" />
            <input
              type="text"
              value={location}
              onFocus={() => setIsLocDropdownOpen(true)}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Search Indian destinations (Goa, Jaipur...)"
              className="w-full text-xs font-semibold text-neutral-900 bg-transparent focus:outline-none placeholder:text-neutral-400"
            />
            {location && (
              <button
                type="button"
                onClick={handleClearLocation}
                className="text-neutral-400 hover:text-black"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Destination Dropdown */}
          {isLocDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setIsLocDropdownOpen(false)}
              />
              <div className="absolute left-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-xl border border-neutral-200 p-3 z-40 animate-zoom-in">
                <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-2">
                  Popular Domestic Destinations
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {POPULAR_DESTINATIONS.map((dest) => (
                    <button
                      key={dest}
                      type="button"
                      onClick={() => {
                        setLocation(dest);
                        setFilters({ location: dest });
                        setIsLocDropdownOpen(false);
                      }}
                      className="text-xs px-2.5 py-1 rounded-full border border-neutral-200 hover:border-black hover:bg-neutral-100 font-medium transition-colors"
                    >
                      {dest}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* 2. When / Dates: ONE OPTION ONLY */}
        <div className="relative flex-1 px-4 py-2 hover:bg-neutral-50 rounded-xl sm:rounded-full transition-colors cursor-pointer group">
          <div onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}>
            <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block">
              When (One-Click Dates)
            </label>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Calendar className="w-3.5 h-3.5 text-neutral-400 group-hover:text-black shrink-0" />
              <span className={`text-xs font-semibold truncate ${selectedDates ? "text-neutral-900" : "text-neutral-400"}`}>
                {selectedDates || "Select Dates in 1 Click"}
              </span>
              <ChevronDown className="w-3 h-3 text-neutral-400 ml-auto shrink-0" />
            </div>
          </div>

          {/* Single Date Selection Popover (NO MULTIPLE FIELDS) */}
          {isDatePickerOpen && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setIsDatePickerOpen(false)}
              />
              <div className="absolute left-0 sm:left-auto sm:right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-neutral-200 p-4 z-40 space-y-4 animate-zoom-in">
                <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
                  <span className="text-xs font-bold text-neutral-900">
                    Single Date Selection
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsDatePickerOpen(false)}
                    className="text-neutral-400 hover:text-black"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* 1-Click Quick Options */}
                <div className="space-y-1.5">
                  <p className="text-[10px] font-bold uppercase text-neutral-400">
                    Instant 1-Click Stays:
                  </p>
                  <button
                    type="button"
                    onClick={() => setQuickDate("This Weekend", 2, 2)}
                    className="w-full p-2.5 rounded-xl border border-neutral-200 hover:border-black hover:bg-neutral-50 text-left text-xs font-semibold flex items-center justify-between transition-colors"
                  >
                    <span>This Weekend (Fri – Sun)</span>
                    <span className="text-[10px] text-neutral-400">2 nights</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setQuickDate("Next Weekend", 9, 3)}
                    className="w-full p-2.5 rounded-xl border border-neutral-200 hover:border-black hover:bg-neutral-50 text-left text-xs font-semibold flex items-center justify-between transition-colors"
                  >
                    <span>Next Long Weekend</span>
                    <span className="text-[10px] text-neutral-400">3 nights</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setQuickDate("Next Week Getaway", 7, 5)}
                    className="w-full p-2.5 rounded-xl border border-neutral-200 hover:border-black hover:bg-neutral-50 text-left text-xs font-semibold flex items-center justify-between transition-colors"
                  >
                    <span>Mid-Week Workation</span>
                    <span className="text-[10px] text-neutral-400">5 nights</span>
                  </button>
                </div>

                {/* Single Date Picker Input */}
                <div className="pt-2 border-t border-neutral-100">
                  <label className="text-[10px] font-bold uppercase text-neutral-400 block mb-1">
                    Or Pick Start Date:
                  </label>
                  <input
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    onChange={handleCustomDateChange}
                    className="w-full p-2 text-xs font-semibold border border-neutral-200 rounded-lg focus:outline-none focus:border-black cursor-pointer bg-neutral-50"
                  />
                  <p className="text-[10px] text-neutral-400 mt-1">
                    Auto-selects stay dates without multiple confusing inputs.
                  </p>
                </div>

                {selectedDates && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedDates("");
                      setFilters({ checkIn: undefined, checkOut: undefined });
                      setIsDatePickerOpen(false);
                    }}
                    className="text-[11px] text-neutral-500 hover:text-black underline font-semibold block text-center pt-1"
                  >
                    Clear dates
                  </button>
                )}
              </div>
            </>
          )}
        </div>

        {/* 3. Who / Guests */}
        <div className="relative px-4 py-2 hover:bg-neutral-50 rounded-xl sm:rounded-full transition-colors cursor-pointer group">
          <div onClick={() => setIsGuestOpen(!isGuestOpen)}>
            <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block">
              Who
            </label>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Users className="w-3.5 h-3.5 text-neutral-400 group-hover:text-black shrink-0" />
              <span className="text-xs font-semibold text-neutral-900">
                {guests} {guests > 1 ? "guests" : "guest"}
              </span>
              <ChevronDown className="w-3 h-3 text-neutral-400 ml-auto shrink-0" />
            </div>
          </div>

          {/* Guest Count Dropdown */}
          {isGuestOpen && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setIsGuestOpen(false)}
              />
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-xl border border-neutral-200 p-2 z-40 animate-zoom-in">
                {[1, 2, 3, 4, 6, 8].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => {
                      setGuests(num);
                      setFilters({ guests: num });
                      setIsGuestOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-2 rounded-xl text-xs font-semibold transition-colors ${
                      guests === num
                        ? "bg-black text-white"
                        : "hover:bg-neutral-100 text-neutral-800"
                    }`}
                  >
                    <span>{num} {num > 1 ? "Guests" : "Guest"}</span>
                    {guests === num && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* 4. Instant Search Button */}
        <div className="p-1 sm:pl-2">
          <button
            type="submit"
            className="w-full sm:w-auto bg-black text-white px-6 py-3 rounded-xl sm:rounded-full text-xs font-bold hover:bg-neutral-800 transition-all flex items-center justify-center gap-2 active:scale-95 shadow-md"
          >
            <Search className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Search</span>
          </button>
        </div>
      </form>
    </div>
  );
}
