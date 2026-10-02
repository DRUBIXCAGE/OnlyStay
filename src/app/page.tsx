"use client";

import React, { useEffect, useState } from "react";
import { FilterBar } from "@/components/FilterBar";
import { ListingCard } from "@/components/ListingCard";
import { InteractiveMap } from "@/components/InteractiveMap";
import { EasySearchBar } from "@/components/EasySearchBar";
import { useUIStore } from "@/lib/store";
import { ListingItem } from "@/types";
import { Loader2, SlidersHorizontal, MapPin, Sparkles, Map as MapIcon, Grid } from "lucide-react";

export default function HomePage() {
  const { filters, viewMode, setViewMode, resetFilters } = useUIStore();
  const [listings, setListings] = useState<ListingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchListings() {
      setIsLoading(true);
      setError(null);

      try {
        const queryParams = new URLSearchParams();
        if (filters.location) queryParams.set("location", filters.location);
        if (filters.category && filters.category !== "All") queryParams.set("category", filters.category);
        if (filters.minPrice !== undefined && filters.minPrice > 0)
          queryParams.set("minPrice", filters.minPrice.toString());
        if (filters.maxPrice !== undefined && filters.maxPrice < 75000)
          queryParams.set("maxPrice", filters.maxPrice.toString());
        if (filters.propertyTypes && filters.propertyTypes.length > 0)
          queryParams.set("propertyTypes", filters.propertyTypes.join(","));
        if (filters.roomType && filters.roomType !== "any")
          queryParams.set("roomType", filters.roomType);
        if (filters.guests && filters.guests > 1)
          queryParams.set("guests", filters.guests.toString());
        if (filters.instantOnly)
          queryParams.set("instantOnly", "true");
        if (filters.amenities && filters.amenities.length > 0)
          queryParams.set("amenities", filters.amenities.join(","));

        const res = await fetch(`/api/listings?${queryParams.toString()}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to fetch stays");
        }

        setListings(data.listings || []);
      } catch (err: any) {
        setError(err.message || "Failed to load stays");
      } finally {
        setIsLoading(false);
      }
    }

    fetchListings();
  }, [filters]);

  return (
    <div className="w-full min-h-screen flex flex-col bg-white">
      {/* 1. Easy Single-Option Search Bar Directly on Home Screen */}
      <div className="bg-neutral-50/70 border-b border-neutral-200/80 pt-4 pb-2 px-4">
        <EasySearchBar />
      </div>

      {/* 2. Category & Filter Navigation Bar */}
      <FilterBar />

      {/* 3. Main Content Area: Clean Full-Width Listing Grid (Map Removed from Home Screen) */}
      <div className="max-w-[1720px] mx-auto px-4 sm:px-8 py-6 w-full flex-1 flex flex-col">
        {/* Active Filter Chips Bar */}
        {(filters.location || (filters.category && filters.category !== "All") || filters.instantOnly) && (
          <div className="flex items-center gap-2 mb-6 overflow-x-auto no-scrollbar pb-1 text-xs">
            <span className="text-neutral-400 font-medium">Filtered by:</span>
            {filters.location && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 font-semibold text-neutral-800">
                <MapPin className="w-3 h-3" />
                {filters.location}
              </span>
            )}
            {filters.category && filters.category !== "All" && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 font-semibold text-neutral-800">
                <Sparkles className="w-3 h-3" />
                {filters.category}
              </span>
            )}
            {filters.instantOnly && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 font-semibold text-neutral-800">
                Instant Book
              </span>
            )}
            <button
              onClick={resetFilters}
              className="text-neutral-500 hover:text-black font-semibold ml-2 underline"
            >
              Reset all
            </button>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex-1 flex flex-col items-center justify-center py-24 space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-neutral-800" />
            <p className="text-xs font-semibold text-neutral-500">
              Searching architectural stays across India...
            </p>
          </div>
        )}

        {/* Error State */}
        {!isLoading && error && (
          <div className="p-8 text-center bg-red-50 rounded-3xl border border-red-100 my-8">
            <p className="text-xs font-bold text-red-600 mb-2">{error}</p>
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-bold"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && listings.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center py-20 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400">
              <SlidersHorizontal className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-neutral-900">
              No stays match your search
            </h3>
            <p className="text-xs text-neutral-500 max-w-sm">
              Try searching for popular destinations like Goa, Udaipur, Jaipur, or Manali.
            </p>
            <button
              onClick={resetFilters}
              className="bg-black text-white px-5 py-2.5 rounded-full text-xs font-bold hover:bg-neutral-800 transition-colors"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* Full-Width Grid of Stays (Clean, No Map on Screen by Default) */}
        {!isLoading && !error && listings.length > 0 && (
          <>
            {viewMode === "map" ? (
              <div className="w-full h-[calc(100vh-220px)] rounded-3xl overflow-hidden border border-neutral-200">
                <InteractiveMap listings={listings} />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                    {listings.length} architectural stay{listings.length > 1 ? "s" : ""} available in India
                  </p>
                  <button
                    onClick={() => setViewMode(viewMode === "map" ? "grid" : "map")}
                    className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border border-neutral-200 hover:border-black transition-colors"
                  >
                    <MapIcon className="w-3.5 h-3.5" />
                    <span>View Map</span>
                  </button>
                </div>

                {/* Clean Full-Width 4-5 Column Listing Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 gap-x-6 gap-y-8">
                  {listings.map((listing) => (
                    <ListingCard key={listing.id} listing={listing} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Floating Map/List Toggle Button */}
      <div className="fixed bottom-6 inset-x-0 flex justify-center z-30 pointer-events-none pb-2">
        <button
          onClick={() => setViewMode(viewMode === "map" ? "grid" : "map")}
          className="pointer-events-auto bg-black text-white px-5 py-2.5 rounded-full text-xs font-bold shadow-xl flex items-center gap-2 hover:bg-neutral-800 transition-all active:scale-95"
        >
          {viewMode === "map" ? (
            <>
              <Grid className="w-3.5 h-3.5" />
              <span>Show Listings</span>
            </>
          ) : (
            <>
              <MapIcon className="w-3.5 h-3.5" />
              <span>Show Map</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
