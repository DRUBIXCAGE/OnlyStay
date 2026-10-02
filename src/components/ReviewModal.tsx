"use client";

import React, { useState } from "react";
import { X, Star, Loader2, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  listingId: string;
  listingTitle: string;
  onReviewSubmitted: () => void;
}

export function ReviewModal({
  isOpen,
  onClose,
  listingId,
  listingTitle,
  onReviewSubmitted,
}: ReviewModalProps) {
  const { user } = useAuth();
  const [rating, setRating] = useState(5);
  const [cleanliness, setCleanliness] = useState(5);
  const [accuracy, setAccuracy] = useState(5);
  const [communication, setCommunication] = useState(5);
  const [location, setLocation] = useState(5);
  const [value, setValue] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim().length < 10) {
      setError("Please write at least 10 characters for your review.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listingId,
          authorId: user?.id || "guest_aarav",
          rating,
          cleanlinessRating: cleanliness,
          accuracyRating: accuracy,
          communicationRating: communication,
          locationRating: location,
          checkinRating: 5,
          valueRating: value,
          comment: comment.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit review");
      }

      setIsSuccess(true);
      setTimeout(() => {
        onReviewSubmitted();
        onClose();
      }, 1200);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const StarSelector = ({ value: currentVal, onChange }: { value: number; onChange: (v: number) => void }) => (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          type="button"
          key={star}
          onClick={() => onChange(star)}
          className="p-1 hover:scale-110 transition-transform"
        >
          <Star
            className={`w-4 h-4 ${
              star <= currentVal ? "fill-black text-black" : "text-neutral-300"
            }`}
          />
        </button>
      ))}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden flex flex-col animate-zoom-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-neutral-100">
          <h2 className="text-sm font-bold text-neutral-900">
            Write a Verified Stay Review
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-neutral-100 flex items-center justify-center text-neutral-400 hover:text-neutral-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-8 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h3 className="text-lg font-bold text-neutral-900">Thank you for your feedback!</h3>
            <p className="text-xs text-neutral-500">Your review has been published.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div>
              <h3 className="text-xs font-bold text-neutral-900">{listingTitle}</h3>
              <p className="text-[11px] text-neutral-500">Reviewing as {user?.name}</p>
            </div>

            {error && (
              <div className="p-2.5 bg-red-50 text-red-600 rounded-xl text-xs">
                {error}
              </div>
            )}

            {/* Overall Rating */}
            <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl">
              <span className="text-xs font-bold text-neutral-900">Overall Rating</span>
              <StarSelector value={rating} onChange={setRating} />
            </div>

            {/* Sub-ratings */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="flex items-center justify-between p-2 border border-neutral-200 rounded-lg">
                <span className="text-neutral-600">Cleanliness</span>
                <StarSelector value={cleanliness} onChange={setCleanliness} />
              </div>
              <div className="flex items-center justify-between p-2 border border-neutral-200 rounded-lg">
                <span className="text-neutral-600">Accuracy</span>
                <StarSelector value={accuracy} onChange={setAccuracy} />
              </div>
              <div className="flex items-center justify-between p-2 border border-neutral-200 rounded-lg">
                <span className="text-neutral-600">Communication</span>
                <StarSelector value={communication} onChange={setCommunication} />
              </div>
              <div className="flex items-center justify-between p-2 border border-neutral-200 rounded-lg">
                <span className="text-neutral-600">Location</span>
                <StarSelector value={location} onChange={setLocation} />
              </div>
            </div>

            {/* Comment */}
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 block mb-1">
                Your experience
              </label>
              <textarea
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Describe the architectural atmosphere, cleanliness, host guidance, or neighborhood nuances..."
                className="w-full p-3 text-xs border border-neutral-200 rounded-xl focus:outline-none focus:border-black transition-colors"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-black text-white py-3 rounded-xl text-xs font-bold hover:bg-neutral-800 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Submitting review...</span>
                </>
              ) : (
                <span>Post Review</span>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
