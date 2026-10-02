"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Star, Heart, ChevronLeft, ChevronRight, Zap } from "lucide-react";
import { ListingItem } from "@/types";
import { formatPrice } from "@/lib/utils";
import { useUIStore } from "@/lib/store";

interface ListingCardProps {
  listing: ListingItem;
}

export function ListingCard({ listing }: ListingCardProps) {
  const { hoveredListingId, setHoveredListingId } = useUIStore();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  const images = listing.images?.length > 0
    ? listing.images.map((img) => img.url)
    : ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"];

  const isHovered = hoveredListingId === listing.id;

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  return (
    <div
      onMouseEnter={() => setHoveredListingId(listing.id)}
      onMouseLeave={() => setHoveredListingId(null)}
      className="group relative flex flex-col cursor-pointer"
    >
      <Link href={`/rooms/${listing.id}`} className="block">
        {/* Photo Container */}
        <div className="relative aspect-[1/0.95] w-full overflow-hidden rounded-2xl bg-neutral-100 mb-3 border border-neutral-200/60 transition-shadow duration-300 group-hover:shadow-md">
          <img
            src={images[currentImageIndex]}
            alt={listing.title}
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          />

          {/* Image Navigation Arrows */}
          {images.length > 1 && (
            <div className="absolute inset-0 flex items-center justify-between p-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={prevImage}
                className="w-7 h-7 rounded-full bg-white/90 hover:bg-white text-black shadow-md flex items-center justify-center transition-transform hover:scale-105"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextImage}
                className="w-7 h-7 rounded-full bg-white/90 hover:bg-white text-black shadow-md flex items-center justify-center transition-transform hover:scale-105"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Dots Indicator */}
          {images.length > 1 && (
            <div className="absolute bottom-2.5 inset-x-0 flex justify-center gap-1">
              {images.slice(0, 5).map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1.5 rounded-full transition-all ${
                    idx === currentImageIndex
                      ? "w-4 bg-white"
                      : "w-1.5 bg-white/60"
                  }`}
                />
              ))}
            </div>
          )}

          {/* Wishlist Heart */}
          <button
            onClick={toggleFavorite}
            className="absolute top-3 right-3 p-1.5 rounded-full hover:scale-110 active:scale-95 transition-transform"
          >
            <Heart
              className={`w-5 h-5 transition-colors drop-shadow-sm ${
                isFavorite
                  ? "fill-red-500 text-red-500"
                  : "text-white fill-black/20 hover:text-white/90"
              }`}
            />
          </button>

          {/* Category Tag */}
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-[11px] font-bold tracking-tight text-neutral-900 border border-neutral-200/60 shadow-xs">
            {listing.category}
          </div>
        </div>

        {/* Info Content */}
        <div className="space-y-1">
          <div className="flex items-baseline justify-between gap-1">
            <h3 className="font-bold text-sm tracking-tight text-neutral-900 truncate">
              {listing.city}, {listing.country}
            </h3>
            <div className="flex items-center gap-1 text-xs font-semibold text-neutral-900 shrink-0">
              <Star className="w-3.5 h-3.5 fill-black stroke-black" />
              <span>{listing.rating.toFixed(2)}</span>
            </div>
          </div>

          <p className="text-xs text-neutral-500 truncate leading-snug">
            {listing.title}
          </p>

          <p className="text-[11px] text-neutral-400">
            {listing.bedrooms} bed{listing.bedrooms > 1 ? "s" : ""} · {listing.propertyType}
          </p>

          <div className="pt-1 flex items-baseline gap-1">
            <span className="font-extrabold text-sm text-neutral-900">
              {formatPrice(listing.pricePerNight)}
            </span>
            <span className="text-xs text-neutral-600 font-normal">night</span>
            {listing.instantBookable && (
              <span className="ml-auto inline-flex items-center gap-0.5 text-[10px] font-semibold text-neutral-600 bg-neutral-100 px-1.5 py-0.5 rounded">
                <Zap className="w-2.5 h-2.5 fill-current" />
                Instant
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
