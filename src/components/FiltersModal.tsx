"use client";

import React, { useState, useEffect } from "react";
import { X, Check, Zap } from "lucide-react";
import { useUIStore } from "@/lib/store";

const AMENITY_OPTIONS = [
  { key: "wifi", label: "Fast Wi-Fi" },
  { key: "workspace", label: "Dedicated workspace" },
  { key: "kitchen", label: "Chef's kitchen" },
  { key: "ac", label: "Air conditioning" },
  { key: "pool", label: "Private pool" },
  { key: "hot_tub", label: "Hot tub / Soaking bath" },
  { key: "ev_charger", label: "EV charger" },
  { key: "washer", label: "Washer & dryer" },
  { key: "fireplace", label: "Indoor fireplace" },
  { key: "ocean_view", label: "Ocean / Sea view" },
  { key: "mountain_view", label: "Mountain / Alpine view" },
];

const PROPERTY_TYPES = [
  "Entire home",
  "Private room",
  "Boutique stay",
  "Shared room",
];

export function FiltersModal() {
  const { isFiltersModalOpen, closeFiltersModal, filters, setFilters, resetFilters } = useUIStore();

  const [minPrice, setMinPrice] = useState(filters.minPrice ?? 0);
  const [maxPrice, setMaxPrice] = useState(filters.maxPrice ?? 75000);
  const [selectedTypes, setSelectedTypes] = useState<string[]>(filters.propertyTypes ?? []);
  const [instantOnly, setInstantOnly] = useState(filters.instantOnly ?? false);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(filters.amenities ?? []);

  useEffect(() => {
    if (isFiltersModalOpen) {
      setMinPrice(filters.minPrice ?? 0);
      setMaxPrice(filters.maxPrice ?? 75000);
      setSelectedTypes(filters.propertyTypes ?? []);
      setInstantOnly(filters.instantOnly ?? false);
      setSelectedAmenities(filters.amenities ?? []);
    }
  }, [isFiltersModalOpen, filters]);

  if (!isFiltersModalOpen) return null;

  const toggleAmenity = (key: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const togglePropertyType = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleApply = () => {
    setFilters({
      minPrice,
      maxPrice,
      propertyTypes: selectedTypes,
      instantOnly,
      amenities: selectedAmenities,
    });
    closeFiltersModal();
  };

  const handleReset = () => {
    setMinPrice(0);
    setMaxPrice(75000);
    setSelectedTypes([]);
    setInstantOnly(false);
    setSelectedAmenities([]);
    resetFilters();
    closeFiltersModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden flex flex-col max-h-[90vh] animate-zoom-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-neutral-100">
          <h2 className="text-base font-bold text-neutral-900">Filters</h2>
          <button
            onClick={closeFiltersModal}
            className="w-8 h-8 rounded-full hover:bg-neutral-100 flex items-center justify-center text-neutral-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Price Range */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-neutral-900">Price range (INR)</h3>
            <p className="text-xs text-neutral-500">Nightly prices in Indian Rupees (₹) before taxes</p>
            <div className="flex items-center gap-3">
              <div className="flex-1 p-3 border border-neutral-200 rounded-xl focus-within:border-black transition-colors">
                <span className="text-[10px] uppercase font-bold text-neutral-400 block">Minimum</span>
                <div className="flex items-center gap-1 font-semibold text-sm">
                  <span>₹</span>
                  <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full focus:outline-none"
                  />
                </div>
              </div>
              <span className="text-neutral-300 font-bold">—</span>
              <div className="flex-1 p-3 border border-neutral-200 rounded-xl focus-within:border-black transition-colors">
                <span className="text-[10px] uppercase font-bold text-neutral-400 block">Maximum</span>
                <div className="flex items-center gap-1 font-semibold text-sm">
                  <span>₹</span>
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Math.max(minPrice, parseInt(e.target.value) || 75000))}
                    className="w-full focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="h-px bg-neutral-100" />

          {/* Property Types */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-neutral-900">Property type</h3>
            <div className="grid grid-cols-2 gap-2">
              {PROPERTY_TYPES.map((type) => {
                const isSelected = selectedTypes.includes(type);
                return (
                  <button
                    key={type}
                    onClick={() => togglePropertyType(type)}
                    className={`flex items-center justify-between p-3.5 rounded-xl border text-xs font-semibold transition-all ${
                      isSelected
                        ? "border-black bg-neutral-900 text-white"
                        : "border-neutral-200 text-neutral-800 hover:border-neutral-300"
                    }`}
                  >
                    <span>{type}</span>
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="h-px bg-neutral-100" />

          {/* Instant Book Toggle */}
          <div className="flex items-center justify-between py-1">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                <h3 className="text-sm font-bold text-neutral-900">Instant Book</h3>
              </div>
              <p className="text-xs text-neutral-500">
                Book without waiting for host approval
              </p>
            </div>
            <button
              onClick={() => setInstantOnly(!instantOnly)}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                instantOnly ? "bg-black" : "bg-neutral-200"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform transform absolute top-0.5 ${
                  instantOnly ? "translate-x-6" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>

          <div className="h-px bg-neutral-100" />

          {/* Amenities Checklist */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-neutral-900">Amenities</h3>
            <div className="grid grid-cols-2 gap-2">
              {AMENITY_OPTIONS.map((amenity) => {
                const isChecked = selectedAmenities.includes(amenity.key);
                return (
                  <button
                    key={amenity.key}
                    onClick={() => toggleAmenity(amenity.key)}
                    className={`flex items-center justify-between p-3 rounded-xl border text-xs font-medium transition-all ${
                      isChecked
                        ? "border-black bg-neutral-100 text-black font-bold"
                        : "border-neutral-200 text-neutral-700 hover:border-neutral-300"
                    }`}
                  >
                    <span>{amenity.label}</span>
                    <div
                      className={`w-4 h-4 rounded border flex items-center justify-center ${
                        isChecked ? "bg-black border-black text-white" : "border-neutral-300 bg-white"
                      }`}
                    >
                      {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-neutral-50 border-t border-neutral-100 flex items-center justify-between">
          <button
            onClick={handleReset}
            className="text-xs font-bold text-neutral-500 hover:text-black underline transition-colors"
          >
            Clear all
          </button>
          <button
            onClick={handleApply}
            className="bg-black text-white px-6 py-2.5 rounded-full text-xs font-bold hover:bg-neutral-800 transition-transform active:scale-95"
          >
            Show stays
          </button>
        </div>
      </div>
    </div>
  );
}
