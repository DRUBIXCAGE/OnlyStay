import { create } from "zustand";
import { SearchFilters, ListingItem } from "@/types";

interface UIState {
  // Modal states
  isSearchModalOpen: boolean;
  isFiltersModalOpen: boolean;
  openSearchModal: () => void;
  closeSearchModal: () => void;
  openFiltersModal: () => void;
  closeFiltersModal: () => void;

  // Search and Filter criteria
  filters: SearchFilters;
  setFilter: <K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) => void;
  setFilters: (filters: Partial<SearchFilters>) => void;
  resetFilters: () => void;

  // Split-view layout: "split" (both list & map), "grid" (full width grid), "map" (full map)
  viewMode: "split" | "grid" | "map";
  setViewMode: (mode: "split" | "grid" | "map") => void;

  // Active hover/selection for synced map pins
  hoveredListingId: string | null;
  setHoveredListingId: (id: string | null) => void;

  selectedListing: ListingItem | null;
  setSelectedListing: (listing: ListingItem | null) => void;
}

const defaultFilters: SearchFilters = {
  category: "All",
  location: "",
  minPrice: 0,
  maxPrice: 75000,
  propertyTypes: [],
  roomType: "any",
  guests: 1,
  amenities: [],
  instantOnly: false,
};

export const useUIStore = create<UIState>((set) => ({
  isSearchModalOpen: false,
  isFiltersModalOpen: false,
  openSearchModal: () => set({ isSearchModalOpen: true }),
  closeSearchModal: () => set({ isSearchModalOpen: false }),
  openFiltersModal: () => set({ isFiltersModalOpen: true }),
  closeFiltersModal: () => set({ isFiltersModalOpen: false }),

  filters: defaultFilters,
  setFilter: (key, value) =>
    set((state) => ({
      filters: { ...state.filters, [key]: value },
    })),
  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    })),
  resetFilters: () => set({ filters: defaultFilters }),

  viewMode: "grid",
  setViewMode: (mode) => set({ viewMode: mode }),

  hoveredListingId: null,
  setHoveredListingId: (id) => set({ hoveredListingId: id }),

  selectedListing: null,
  setSelectedListing: (listing) => set({ selectedListing: listing }),
}));
