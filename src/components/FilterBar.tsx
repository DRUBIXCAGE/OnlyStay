"use client";

import React from "react";
import { 
  SlidersHorizontal, 
  Sparkles, 
  Building, 
  Layers, 
  Waves, 
  Sun, 
  Mountain, 
  Building2,
  Columns,
  Grid,
  Map as MapIcon,
  X
} from "lucide-react";
import { useUIStore } from "@/lib/store";

const CATEGORIES = [
  { label: "All", icon: Sparkles },
  { label: "Minimalist", icon: Layers },
  { label: "Architectural", icon: Building },
  { label: "Loft", icon: Building2 },
  { label: "Seaside", icon: Waves },
  { label: "Desert", icon: Sun },
  { label: "Alpine", icon: Mountain },
  { label: "Urban", icon: Building },
];

export function FilterBar() {
  const { 
    filters, 
    setFilter, 
    openFiltersModal, 
    viewMode, 
    setViewMode,
    resetFilters
  } = useUIStore();

  // Calculate active filter count
  const activeFiltersCount = [
    filters.location ? 1 : 0,
    filters.minPrice && filters.minPrice > 0 ? 1 : 0,
    filters.maxPrice && filters.maxPrice < 75000 ? 1 : 0,
    filters.propertyTypes && filters.propertyTypes.length > 0 ? 1 : 0,
    filters.roomType && filters.roomType !== "any" ? 1 : 0,
    filters.instantOnly ? 1 : 0,
    filters.amenities && filters.amenities.length > 0 ? filters.amenities.length : 0,
    filters.guests && filters.guests > 1 ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  return (
    <div className="w-full bg-white border-b border-neutral-200/70 sticky top-20 z-30 transition-all">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-8 py-3 flex items-center justify-between gap-4">
        {/* Category Icons Carousel */}
        <div className="flex items-center gap-6 overflow-x-auto no-scrollbar py-1">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = (filters.category || "All") === cat.label;
            return (
              <button
                key={cat.label}
                onClick={() => setFilter("category", cat.label)}
                className={`flex flex-col items-center gap-1.5 pb-1 border-b-2 text-xs font-semibold whitespace-nowrap transition-all duration-150 ${
                  isSelected
                    ? "border-black text-black opacity-100"
                    : "border-transparent text-neutral-500 hover:text-neutral-800 hover:border-neutral-300 opacity-70 hover:opacity-100"
                }`}
              >
                <Icon className="w-5 h-5 stroke-[1.8]" />
                <span className="tracking-tight">{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right side: Filters button & Split-View Mode Switcher */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Active Filters Clear Button if any active */}
          {activeFiltersCount > 0 && (
            <button
              onClick={resetFilters}
              className="hidden lg:flex items-center gap-1 text-xs text-neutral-500 hover:text-black py-2 px-2.5 rounded-full hover:bg-neutral-100 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}

          {/* Filters Modal Trigger */}
          <button
            onClick={openFiltersModal}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl border text-xs font-bold transition-all ${
              activeFiltersCount > 0
                ? "border-black bg-black text-white shadow-sm"
                : "border-neutral-200 text-neutral-800 hover:border-neutral-400 bg-white"
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-white text-black text-[10px] font-extrabold flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {/* Split-View Layout Toggle (Desktop) */}
          <div className="hidden md:flex items-center border border-neutral-200 rounded-xl p-0.5 bg-neutral-50">
            <button
              title="Split view (Grid + Map)"
              onClick={() => setViewMode("split")}
              className={`p-2 rounded-lg transition-all ${
                viewMode === "split"
                  ? "bg-white text-black shadow-xs font-bold"
                  : "text-neutral-400 hover:text-neutral-800"
              }`}
            >
              <Columns className="w-4 h-4" />
            </button>
            <button
              title="Grid view only"
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-all ${
                viewMode === "grid"
                  ? "bg-white text-black shadow-xs font-bold"
                  : "text-neutral-400 hover:text-neutral-800"
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              title="Map view only"
              onClick={() => setViewMode("map")}
              className={`p-2 rounded-lg transition-all ${
                viewMode === "map"
                  ? "bg-white text-black shadow-xs font-bold"
                  : "text-neutral-400 hover:text-neutral-800"
              }`}
            >
              <MapIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
