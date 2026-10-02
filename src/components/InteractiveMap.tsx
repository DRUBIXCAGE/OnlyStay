"use client";

import React from "react";
import dynamic from "next/dynamic";
import { ListingItem } from "@/types";

const DynamicMap = dynamic(() => import("./MapClient"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[400px] bg-neutral-100 rounded-2xl flex items-center justify-center border border-neutral-200 animate-pulse">
      <div className="flex flex-col items-center gap-2">
        <div className="w-8 h-8 rounded-full border-2 border-neutral-400 border-t-black animate-spin" />
        <span className="text-xs font-semibold text-neutral-500">Loading interactive map...</span>
      </div>
    </div>
  ),
});

interface InteractiveMapProps {
  listings: ListingItem[];
}

export function InteractiveMap({ listings }: InteractiveMapProps) {
  return <DynamicMap listings={listings} />;
}
