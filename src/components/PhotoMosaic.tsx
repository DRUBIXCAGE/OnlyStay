"use client";

import React, { useState, useEffect } from "react";
import { Grid, X, ChevronLeft, ChevronRight } from "lucide-react";
import { ListingImageItem } from "@/types";

interface PhotoMosaicProps {
  images: ListingImageItem[];
  title: string;
}

export function PhotoMosaic({ images, title }: PhotoMosaicProps) {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  const displayImages = images.length > 0 ? images : [
    { url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80", orderIndex: 0 }
  ];

  // Keyboard controls for lightbox
  useEffect(() => {
    if (!isLightboxOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsLightboxOpen(false);
      if (e.key === "ArrowRight") {
        setActivePhotoIndex((prev) => (prev + 1) % displayImages.length);
      }
      if (e.key === "ArrowLeft") {
        setActivePhotoIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLightboxOpen, displayImages.length]);

  return (
    <>
      {/* 5-Photo Mosaic Grid */}
      <div className="relative rounded-3xl overflow-hidden grid grid-cols-1 md:grid-cols-4 gap-2 h-[340px] sm:h-[460px] border border-neutral-200/80 bg-neutral-100">
        {/* Main Hero Photo (Takes 2 cols) */}
        <div
          onClick={() => {
            setActivePhotoIndex(0);
            setIsLightboxOpen(true);
          }}
          className="md:col-span-2 relative h-full cursor-pointer overflow-hidden group"
        >
          <img
            src={displayImages[0]?.url}
            alt={`${title} main`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
        </div>

        {/* 2nd & 3rd photos (Column 3) */}
        <div className="hidden md:grid grid-rows-2 gap-2 h-full">
          <div
            onClick={() => {
              setActivePhotoIndex(1);
              setIsLightboxOpen(true);
            }}
            className="relative h-full cursor-pointer overflow-hidden group"
          >
            <img
              src={displayImages[1]?.url || displayImages[0]?.url}
              alt={`${title} 2`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
          </div>
          <div
            onClick={() => {
              setActivePhotoIndex(2);
              setIsLightboxOpen(true);
            }}
            className="relative h-full cursor-pointer overflow-hidden group"
          >
            <img
              src={displayImages[2]?.url || displayImages[0]?.url}
              alt={`${title} 3`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
          </div>
        </div>

        {/* 4th & 5th photos (Column 4) */}
        <div className="hidden md:grid grid-rows-2 gap-2 h-full">
          <div
            onClick={() => {
              setActivePhotoIndex(3);
              setIsLightboxOpen(true);
            }}
            className="relative h-full cursor-pointer overflow-hidden group"
          >
            <img
              src={displayImages[3]?.url || displayImages[0]?.url}
              alt={`${title} 4`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
          </div>
          <div
            onClick={() => {
              setActivePhotoIndex(4);
              setIsLightboxOpen(true);
            }}
            className="relative h-full cursor-pointer overflow-hidden group"
          >
            <img
              src={displayImages[4]?.url || displayImages[0]?.url}
              alt={`${title} 5`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
          </div>
        </div>

        {/* Floating "Show all photos" Button */}
        <button
          onClick={() => {
            setActivePhotoIndex(0);
            setIsLightboxOpen(true);
          }}
          className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-md text-black px-4 py-2 rounded-xl text-xs font-bold border border-neutral-200/90 shadow-sm hover:shadow-md hover:bg-white flex items-center gap-2 transition-all active:scale-95"
        >
          <Grid className="w-3.5 h-3.5" />
          <span>Show all {displayImages.length} photos</span>
        </button>
      </div>

      {/* Fullscreen Lightbox Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between p-4 sm:p-8 animate-fade-in text-white">
          {/* Lightbox Header */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold tracking-wide text-neutral-400">
              {activePhotoIndex + 1} / {displayImages.length}
            </span>
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="p-2 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Central Image with Prev / Next */}
          <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden">
            <button
              onClick={() =>
                setActivePhotoIndex(
                  (prev) => (prev - 1 + displayImages.length) % displayImages.length
                )
              }
              className="absolute left-2 sm:left-6 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all hover:scale-110"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <img
              src={displayImages[activePhotoIndex]?.url}
              alt={displayImages[activePhotoIndex]?.caption || title}
              className="max-h-[75vh] max-w-[90vw] object-contain rounded-xl shadow-2xl transition-all duration-300"
            />

            <button
              onClick={() =>
                setActivePhotoIndex((prev) => (prev + 1) % displayImages.length)
              }
              className="absolute right-2 sm:right-6 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all hover:scale-110"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Bottom Thumbnails Strip */}
          <div className="flex items-center justify-center gap-2 overflow-x-auto py-2 no-scrollbar">
            {displayImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActivePhotoIndex(idx)}
                className={`relative w-16 h-12 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                  idx === activePhotoIndex
                    ? "border-white scale-105 opacity-100"
                    : "border-transparent opacity-50 hover:opacity-80"
                }`}
              >
                <img
                  src={img.url}
                  alt={`Thumbnail ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
