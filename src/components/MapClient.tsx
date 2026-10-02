"use client";

import React, { useEffect, useRef } from "react";
import L from "leaflet";
import { ListingItem } from "@/types";
import { formatPrice } from "@/lib/utils";
import { useUIStore } from "@/lib/store";
import Link from "next/link";

interface MapClientProps {
  listings: ListingItem[];
}

export default function MapClient({ listings }: MapClientProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [id: string]: L.Marker }>({});
  const { hoveredListingId, setHoveredListingId } = useUIStore();

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Default to Europe/Asia center or first listing coords
      const initialLat = listings.length > 0 ? listings[0].lat : 35.0037;
      const initialLng = listings.length > 0 ? listings[0].lng : 135.7772;

      const map = L.map(mapContainerRef.current, {
        center: [initialLat, initialLng],
        zoom: listings.length === 1 ? 13 : 3,
        zoomControl: false,
      });

      // Minimalist monochrome CartoDB Positron tiles
      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
        {
          attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
          maxZoom: 19,
          subdomains: "abcd",
        }
      ).addTo(map);

      // Add zoom control top-right
      L.control.zoom({ position: "topright" }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Clear existing markers
    Object.values(markersRef.current).forEach((marker) => marker.remove());
    markersRef.current = {};

    // Add custom price pill markers for each listing
    const bounds = L.latLngBounds([]);

    listings.forEach((listing) => {
      const priceText = formatPrice(listing.pricePerNight);
      const isHovered = hoveredListingId === listing.id;

      const customIcon = L.divIcon({
        className: "custom-leaflet-container",
        html: `<div id="pin-${listing.id}" class="custom-map-pin ${isHovered ? "active" : ""}">${priceText}</div>`,
        iconSize: [60, 28],
        iconAnchor: [30, 14],
      });

      const marker = L.marker([listing.lat, listing.lng], { icon: customIcon }).addTo(map);

      // Popup card content
      const popupHtml = `
        <div style="min-width: 220px; font-family: inherit; padding: 2px;">
          <a href="/rooms/${listing.id}" style="text-decoration: none; color: inherit; display: block;">
            <div style="width: 100%; height: 130px; border-radius: 12px; overflow: hidden; margin-bottom: 8px; background: #f3f4f6;">
              <img src="${listing.images?.[0]?.url || ""}" alt="${listing.title}" style="width: 100%; height: 100%; object-fit: cover;" />
            </div>
            <div style="font-weight: 700; font-size: 13px; color: #111827; margin-bottom: 2px;">${listing.city}, ${listing.country}</div>
            <div style="font-size: 12px; color: #6b7280; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 4px;">${listing.title}</div>
            <div style="font-size: 13px; font-weight: 800; color: #000000;">${priceText} <span style="font-weight: 400; font-size: 11px; color: #6b7280;">night</span></div>
          </a>
        </div>
      `;

      marker.bindPopup(popupHtml, {
        closeButton: false,
        className: "minimalist-map-popup",
        offset: [0, -10],
      });

      marker.on("mouseover", () => {
        setHoveredListingId(listing.id);
      });

      marker.on("mouseout", () => {
        setHoveredListingId(null);
      });

      markersRef.current[listing.id] = marker;
      bounds.extend([listing.lat, listing.lng]);
    });

    if (listings.length > 1 && bounds.isValid()) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 });
    } else if (listings.length === 1) {
      map.setView([listings[0].lat, listings[0].lng], 13);
    }
  }, [listings]);

  // Sync hovered state from grid to map markers
  useEffect(() => {
    listings.forEach((l) => {
      const pinEl = document.getElementById(`pin-${l.id}`);
      if (pinEl) {
        if (hoveredListingId === l.id) {
          pinEl.classList.add("active");
        } else {
          pinEl.classList.remove("active");
        }
      }
    });
  }, [hoveredListingId, listings]);

  return (
    <div className="relative w-full h-full min-h-[400px] overflow-hidden rounded-2xl border border-neutral-200">
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
}
