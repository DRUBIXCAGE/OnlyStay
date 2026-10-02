"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Building, 
  MapPin, 
  Users, 
  Sparkles, 
  Image as ImageIcon, 
  FileText, 
  DollarSign, 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  Plus, 
  Trash2, 
  Loader2,
  AlertCircle
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { ListingWizardSchema } from "@/lib/validations";

const PROPERTY_TYPES = [
  { label: "Entire home", desc: "Guests have the whole place to themselves" },
  { label: "Private room", desc: "Guests have their own private room in a home" },
  { label: "Boutique stay", desc: "Curated design suite or architectural pavilion" },
  { label: "Shared room", desc: "Guests sleep in a room shared with others" },
];

const CATEGORIES = [
  "Minimalist",
  "Architectural",
  "Loft",
  "Seaside",
  "Desert",
  "Alpine",
  "Urban",
];

const AMENITY_OPTIONS = [
  { key: "wifi", label: "Fast Wi-Fi" },
  { key: "workspace", label: "Dedicated workspace" },
  { key: "kitchen", label: "Gourmet kitchen" },
  { key: "ac", label: "Air conditioning" },
  { key: "pool", label: "Private pool" },
  { key: "hot_tub", label: "Hot tub / Cedar bath" },
  { key: "ev_charger", label: "EV charger" },
  { key: "washer", label: "Washer & dryer" },
  { key: "fireplace", label: "Indoor fireplace" },
  { key: "ocean_view", label: "Ocean view" },
  { key: "mountain_view", label: "Mountain view" },
];

const PRESET_PHOTOS = [
  "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80",
];

export default function NewListingWizard() {
  const router = useRouter();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 7;

  // Form State
  const [propertyType, setPropertyType] = useState("Entire home");
  const [roomType, setRoomType] = useState<"entire" | "private" | "shared">("entire");
  const [category, setCategory] = useState("Minimalist");

  const [address, setAddress] = useState("Villa 12, Chogm Road, Assagao");
  const [city, setCity] = useState("Goa");
  const [country, setCountry] = useState("India");
  const [lat, setLat] = useState(15.5898);
  const [lng, setLng] = useState(73.7744);

  const [maxGuests, setMaxGuests] = useState(4);
  const [bedrooms, setBedrooms] = useState(2);
  const [beds, setBeds] = useState(2);
  const [baths, setBaths] = useState(2);

  const [amenities, setAmenities] = useState<string[]>(["wifi", "workspace", "kitchen", "ac", "pool"]);

  const [images, setImages] = useState<string[]>(PRESET_PHOTOS.slice(0, 4));
  const [customImageUrl, setCustomImageUrl] = useState("");

  const [title, setTitle] = useState("Assagao Portuguese Heritage Villa & Courtyard");
  const [description, setDescription] = useState(
    "A restored 180-year-old Indo-Portuguese sanctuary framed by hand-hewn laterite stone, mother-of-pearl oyster shell windows, private lap pool, and lush frangipani garden."
  );
  const [houseRules, setHouseRules] = useState("No loud amplified music after 10 PM. Footwear off in main salon.");

  const [pricePerNight, setPricePerNight] = useState(18500);
  const [weekendSurge, setWeekendSurge] = useState(2500);
  const [cleaningFee, setCleaningFee] = useState(1500);
  const [minNights, setMinNights] = useState(2);
  const [cancellationPolicy, setCancellationPolicy] = useState<"FLEXIBLE" | "MODERATE" | "STRICT">("FLEXIBLE");
  const [instantBookable, setInstantBookable] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stepError, setStepError] = useState<string | null>(null);

  const toggleAmenity = (key: string) => {
    setAmenities((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const addCustomImage = () => {
    if (customImageUrl.trim() && customImageUrl.startsWith("http")) {
      setImages((prev) => [...prev, customImageUrl.trim()]);
      setCustomImageUrl("");
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const validateCurrentStep = (): boolean => {
    setStepError(null);
    if (currentStep === 1) {
      if (!propertyType || !category) {
        setStepError("Please select property type and category");
        return false;
      }
    } else if (currentStep === 2) {
      if (!address.trim() || !city.trim() || !country.trim()) {
        setStepError("Address, City, and Country are required");
        return false;
      }
    } else if (currentStep === 4) {
      if (amenities.length === 0) {
        setStepError("Please select at least 1 amenity");
        return false;
      }
    } else if (currentStep === 5) {
      if (images.length < 3) {
        setStepError("Please upload or add at least 3 photos for your listing");
        return false;
      }
    } else if (currentStep === 6) {
      if (title.trim().length < 8) {
        setStepError("Title must be at least 8 characters");
        return false;
      }
      if (description.trim().length < 25) {
        setStepError("Description must be at least 25 characters");
        return false;
      }
    } else if (currentStep === 7) {
      if (pricePerNight < 10) {
        setStepError("Minimum nightly price is $10");
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (!validateCurrentStep()) return;
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    setStepError(null);
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setStepError(null);

    try {
      const payload = {
        hostId: user?.id || "host_marcus",
        category,
        propertyType,
        roomType,
        address,
        city,
        country,
        lat: Number(lat),
        lng: Number(lng),
        maxGuests: Number(maxGuests),
        bedrooms: Number(bedrooms),
        beds: Number(beds),
        baths: Number(baths),
        amenities,
        images,
        title,
        description,
        houseRules: houseRules.trim() || undefined,
        pricePerNight: Number(pricePerNight),
        weekendSurge: Number(weekendSurge),
        cleaningFee: Number(cleaningFee),
        minNights: Number(minNights),
        cancellationPolicy,
        instantBookable,
      };

      const res = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to publish listing");
      }

      router.push(`/rooms/${data.listing.id}`);
    } catch (err: any) {
      setStepError(err.message || "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const progressPercent = Math.round((currentStep / totalSteps) * 100);

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between">
      {/* Top Header with Progress */}
      <div className="border-b border-neutral-200 bg-white sticky top-20 z-20">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-extrabold text-neutral-900">
              Listing Creation Wizard
            </h2>
            <p className="text-[11px] text-neutral-500">
              Step {currentStep} of {totalSteps}: {
                [
                  "Category & Type",
                  "Location & Map Pin",
                  "Capacity Specs",
                  "Amenities",
                  "Photo Gallery",
                  "Title & Description",
                  "Pricing & Policies"
                ][currentStep - 1]
              }
            </p>
          </div>
          <span className="text-xs font-bold text-neutral-900 bg-neutral-100 px-2.5 py-1 rounded-full">
            {progressPercent}%
          </span>
        </div>
        {/* Progress Bar Line */}
        <div className="w-full bg-neutral-100 h-1">
          <div
            className="bg-black h-1 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Main Wizard Form Body */}
      <div className="max-w-2xl mx-auto px-4 py-8 w-full flex-1 animate-fade-in">
        {stepError && (
          <div className="mb-6 p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-2xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{stepError}</span>
          </div>
        )}

        {/* STEP 1: Category & Property Type */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <h1 className="text-xl font-black text-neutral-900 tracking-tight">
                Which best describes your stay?
              </h1>
              <p className="text-xs text-neutral-500 mt-1">
                Choose the architectural atmosphere that guests will experience.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                Architectural Category
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`p-3 rounded-xl border text-xs font-bold text-center transition-all ${
                      category === cat
                        ? "border-black bg-black text-white"
                        : "border-neutral-200 text-neutral-700 hover:border-neutral-400 bg-white"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                Space Access Type
              </label>
              <div className="space-y-2">
                {PROPERTY_TYPES.map((type) => (
                  <button
                    key={type.label}
                    type="button"
                    onClick={() => {
                      setPropertyType(type.label);
                      if (type.label.includes("Entire")) setRoomType("entire");
                      else if (type.label.includes("Private")) setRoomType("private");
                      else setRoomType("shared");
                    }}
                    className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
                      propertyType === type.label
                        ? "border-black bg-neutral-50 shadow-xs"
                        : "border-neutral-200 hover:border-neutral-300"
                    }`}
                  >
                    <div>
                      <p className="text-sm font-bold text-neutral-900">{type.label}</p>
                      <p className="text-xs text-neutral-500">{type.desc}</p>
                    </div>
                    {propertyType === type.label && (
                      <div className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Location & Pin */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <h1 className="text-xl font-black text-neutral-900 tracking-tight">
                Where is your place located?
              </h1>
              <p className="text-xs text-neutral-500 mt-1">
                Your address is only shared with confirmed guests.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 block mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. 142 Mercer Street, Apt 4B"
                  className="w-full p-3 text-xs border border-neutral-200 rounded-xl focus:outline-none focus:border-black"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 block mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Tokyo"
                    className="w-full p-3 text-xs border border-neutral-200 rounded-xl focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 block mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="e.g. Japan"
                    className="w-full p-3 text-xs border border-neutral-200 rounded-xl focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 bg-neutral-50 rounded-2xl border border-neutral-200/80">
                <div>
                  <label className="text-[10px] font-bold uppercase text-neutral-400 block mb-0.5">
                    Latitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={lat}
                    onChange={(e) => setLat(parseFloat(e.target.value) || 0)}
                    className="w-full bg-white p-2 text-xs border border-neutral-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-neutral-400 block mb-0.5">
                    Longitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={lng}
                    onChange={(e) => setLng(parseFloat(e.target.value) || 0)}
                    className="w-full bg-white p-2 text-xs border border-neutral-200 rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Capacity Specs */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <h1 className="text-xl font-black text-neutral-900 tracking-tight">
                Share some basics about your space
              </h1>
              <p className="text-xs text-neutral-500 mt-1">
                You'll add more details later, like bed arrangements.
              </p>
            </div>

            <div className="divide-y divide-neutral-200 border border-neutral-200 rounded-2xl p-4 bg-white space-y-4">
              {[
                { label: "Guests", val: maxGuests, set: setMaxGuests, min: 1, max: 16 },
                { label: "Bedrooms", val: bedrooms, set: setBedrooms, min: 0, max: 10 },
                { label: "Beds", val: beds, set: setBeds, min: 1, max: 20 },
                { label: "Bathrooms", val: baths, set: setBaths, min: 0.5, max: 10, step: 0.5 },
              ].map((item, idx) => (
                <div key={item.label} className={`flex items-center justify-between ${idx > 0 ? "pt-4" : ""}`}>
                  <span className="text-sm font-bold text-neutral-800">{item.label}</span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      disabled={item.val <= item.min}
                      onClick={() => item.set(Math.max(item.min, item.val - (item.step || 1)))}
                      className="w-8 h-8 rounded-full border border-neutral-300 flex items-center justify-center text-sm font-bold disabled:opacity-30 hover:bg-neutral-100"
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-sm font-bold">{item.val}</span>
                    <button
                      type="button"
                      disabled={item.val >= item.max}
                      onClick={() => item.set(item.val + (item.step || 1))}
                      className="w-8 h-8 rounded-full border border-neutral-300 flex items-center justify-center text-sm font-bold disabled:opacity-30 hover:bg-neutral-100"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 4: Amenities */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div>
              <h1 className="text-xl font-black text-neutral-900 tracking-tight">
                Tell guests what your place offers
              </h1>
              <p className="text-xs text-neutral-500 mt-1">
                You can add more amenities after you publish.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {AMENITY_OPTIONS.map((item) => {
                const isSelected = amenities.includes(item.key);
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => toggleAmenity(item.key)}
                    className={`p-3.5 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all ${
                      isSelected
                        ? "border-black bg-black text-white"
                        : "border-neutral-200 text-neutral-700 hover:border-neutral-300"
                    }`}
                  >
                    <span>{item.label}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 5: Photos */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <div>
              <h1 className="text-xl font-black text-neutral-900 tracking-tight">
                Add photos of your stay
              </h1>
              <p className="text-xs text-neutral-500 mt-1">
                Upload or select at least 3 architectural images (Cover photo is the first one).
              </p>
            </div>

            {/* Custom URL Input */}
            <div className="flex gap-2">
              <input
                type="url"
                value={customImageUrl}
                onChange={(e) => setCustomImageUrl(e.target.value)}
                placeholder="Paste high-res image URL (Unsplash, Cloudinary, etc.)"
                className="flex-1 p-3 text-xs border border-neutral-200 rounded-xl focus:outline-none focus:border-black"
              />
              <button
                type="button"
                onClick={addCustomImage}
                className="bg-black text-white px-4 py-3 rounded-xl text-xs font-bold hover:bg-neutral-800"
              >
                Add Photo
              </button>
            </div>

            {/* Photos Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {images.map((img, idx) => (
                <div
                  key={idx}
                  className="relative group aspect-[4/3] rounded-2xl overflow-hidden border border-neutral-200"
                >
                  <img src={img} alt={`Stay photo ${idx + 1}`} className="w-full h-full object-cover" />
                  {idx === 0 && (
                    <span className="absolute top-2 left-2 bg-black text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                      Cover Photo
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/70 hover:bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Preset Architecture Photo Quick Add */}
            <div className="pt-2">
              <p className="text-[11px] font-bold uppercase text-neutral-400 mb-2">
                Or add architectural sample photos:
              </p>
              <div className="flex gap-2 overflow-x-auto no-scrollbar">
                {PRESET_PHOTOS.map((url, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      if (!images.includes(url)) setImages((prev) => [...prev, url]);
                    }}
                    className="relative w-20 h-14 rounded-lg overflow-hidden shrink-0 border border-neutral-200 hover:border-black transition-colors"
                  >
                    <img src={url} alt={`Preset ${i + 1}`} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center text-white text-[10px] font-bold">
                      + Add
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 6: Title, Description, Rules */}
        {currentStep === 6 && (
          <div className="space-y-6">
            <div>
              <h1 className="text-xl font-black text-neutral-900 tracking-tight">
                Now, let's describe your sanctuary
              </h1>
              <p className="text-xs text-neutral-500 mt-1">
                Short titles and architectural descriptions work best.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 block mb-1">
                  Listing Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. The Monolith Cantilever Desert Pavilion"
                  className="w-full p-3 text-xs border border-neutral-200 rounded-xl focus:outline-none focus:border-black font-semibold"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 block mb-1">
                  Description
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the architectural materials, lighting, tranquility, and spatial atmosphere..."
                  className="w-full p-3 text-xs border border-neutral-200 rounded-xl focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 block mb-1">
                  House Rules
                </label>
                <input
                  type="text"
                  value={houseRules}
                  onChange={(e) => setHouseRules(e.target.value)}
                  placeholder="e.g. No shoes indoors, quiet hours after 10 PM"
                  className="w-full p-3 text-xs border border-neutral-200 rounded-xl focus:outline-none focus:border-black"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 7: Pricing & Policies */}
        {currentStep === 7 && (
          <div className="space-y-6">
            <div>
              <h1 className="text-xl font-black text-neutral-900 tracking-tight">
                Set your price and reservation terms
              </h1>
              <p className="text-xs text-neutral-500 mt-1">
                You can adjust pricing and policies anytime from your host dashboard.
              </p>
            </div>

            <div className="space-y-4">
              {/* Base price */}
              <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200">
                <span className="text-xs font-bold uppercase text-neutral-500 block mb-1">
                  Nightly Rate (INR)
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-black text-neutral-900">₹</span>
                  <input
                    type="number"
                    min={500}
                    value={pricePerNight}
                    onChange={(e) => setPricePerNight(parseInt(e.target.value, 10) || 500)}
                    className="text-2xl font-black bg-transparent focus:outline-none w-44"
                  />
                  <span className="text-xs text-neutral-400 font-normal">per night</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 border border-neutral-200 rounded-xl">
                  <span className="text-[10px] font-bold uppercase text-neutral-400 block mb-1">
                    Cleaning Fee (₹)
                  </span>
                  <input
                    type="number"
                    value={cleaningFee}
                    onChange={(e) => setCleaningFee(parseInt(e.target.value, 10) || 0)}
                    className="w-full text-xs font-bold focus:outline-none"
                  />
                </div>
                <div className="p-3 border border-neutral-200 rounded-xl">
                  <span className="text-[10px] font-bold uppercase text-neutral-400 block mb-1">
                    Min Stay (Nights)
                  </span>
                  <input
                    type="number"
                    min={1}
                    value={minNights}
                    onChange={(e) => setMinNights(parseInt(e.target.value, 10) || 1)}
                    className="w-full text-xs font-bold focus:outline-none"
                  />
                </div>
              </div>

              {/* Cancellation policy */}
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 block mb-1">
                  Cancellation Policy
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["FLEXIBLE", "MODERATE", "STRICT"] as const).map((pol) => (
                    <button
                      key={pol}
                      type="button"
                      onClick={() => setCancellationPolicy(pol)}
                      className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                        cancellationPolicy === pol
                          ? "border-black bg-black text-white"
                          : "border-neutral-200 text-neutral-700 hover:border-neutral-300"
                      }`}
                    >
                      {pol}
                    </button>
                  ))}
                </div>
              </div>

              {/* Instant Bookable */}
              <div className="flex items-center justify-between p-3.5 rounded-xl border border-neutral-200">
                <div>
                  <p className="text-xs font-bold text-neutral-900">Instant Book</p>
                  <p className="text-[11px] text-neutral-500">
                    Permit guests to book instantly without waiting for manual confirmation.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setInstantBookable(!instantBookable)}
                  className={`w-11 h-6 rounded-full transition-colors relative ${
                    instantBookable ? "bg-black" : "bg-neutral-200"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform transform absolute top-0.5 ${
                      instantBookable ? "translate-x-5" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sticky Bottom Actions Bar */}
      <div className="border-t border-neutral-200 bg-white p-4 sticky bottom-0 z-20">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <button
            type="button"
            disabled={currentStep === 1 || isSubmitting}
            onClick={handleBack}
            className="flex items-center gap-1.5 text-xs font-bold text-neutral-700 hover:text-black disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleNext}
            className="bg-black text-white px-7 py-3 rounded-full text-xs font-bold hover:bg-neutral-800 disabled:opacity-50 transition-all flex items-center gap-2 active:scale-95 shadow-md"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Publishing stay...</span>
              </>
            ) : currentStep === totalSteps ? (
              <span>Publish Stay</span>
            ) : (
              <>
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
