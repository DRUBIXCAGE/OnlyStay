"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { X, CreditCard, Lock, CheckCircle2, ShieldAlert, Sparkles, Loader2 } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { ListingItem } from "@/types";

interface StripePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  listing: ListingItem;
  startDate: string;
  endDate: string;
  nights: number;
  guestsCount: number;
  totalPrice: number;
  guestId: string;
  onSuccess: () => void;
}

export function StripePaymentModal({
  isOpen,
  onClose,
  listing,
  startDate,
  endDate,
  nights,
  guestsCount,
  totalPrice,
  guestId,
  onSuccess,
}: StripePaymentModalProps) {
  const router = useRouter();
  const [cardNumber, setCardNumber] = useState("4242 •••• •••• 4242");
  const [expiry, setExpiry] = useState("12/28");
  const [cvc, setCvc] = useState("888");
  const [nameOnCard, setNameOnCard] = useState("Aarav Sharma");
  const [upiId, setUpiId] = useState("aarav@okhdfcbank");
  const [paymentMethod, setPaymentMethod] = useState<"card" | "upi">("card");
  const [guestNote, setGuestNote] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setError(null);

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listingId: listing.id,
          guestId: guestId,
          startDate: new Date(startDate).toISOString(),
          endDate: new Date(endDate).toISOString(),
          guestsCount,
          pricePerNight: listing.pricePerNight,
          cleaningFee: listing.cleaningFee,
          serviceFee: listing.serviceFee,
          totalPrice,
          isInstant: listing.instantBookable,
          guestNote: guestNote.trim() || undefined,
          stripePaymentId: `pi_live_mock_${Date.now()}`,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Reservation failed. Selected dates may be unavailable.");
      }

      setIsSuccess(true);
      setTimeout(() => {
        onSuccess();
        router.push("/trips");
      }, 1600);
    } catch (err: any) {
      setError(err.message || "An error occurred during payment processing");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden flex flex-col animate-zoom-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-neutral-100">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-black text-white flex items-center justify-center text-[10px] font-bold">
              S
            </div>
            <h2 className="text-sm font-bold text-neutral-900 tracking-tight">
              Stripe Secure Checkout
            </h2>
          </div>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="w-8 h-8 rounded-full hover:bg-neutral-100 flex items-center justify-center text-neutral-400 hover:text-neutral-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-8 text-center space-y-4 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-100">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-extrabold text-neutral-900">
              Reservation Confirmed!
            </h3>
            <p className="text-xs text-neutral-500 max-w-xs mx-auto">
              Your dates at <span className="font-semibold text-neutral-800">{listing.title}</span> are locked. Confirmation receipt sent.
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 text-xs text-neutral-400">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Redirecting to your trips...
              </span>
            </div>
          </div>
        ) : (
          <form onSubmit={handlePay} className="p-6 space-y-5">
            {/* Stay summary card */}
            <div className="flex items-center gap-4 p-3 bg-neutral-50 rounded-2xl border border-neutral-200/80">
              <img
                src={listing.images[0]?.url || ""}
                alt={listing.title}
                className="w-16 h-16 rounded-xl object-cover"
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-neutral-900 truncate">
                  {listing.title}
                </h4>
                <p className="text-[11px] text-neutral-500">
                  {nights} nights · {guestsCount} guest{guestsCount > 1 ? "s" : ""}
                </p>
                <p className="text-xs font-extrabold text-neutral-900 mt-1">
                  Total: {formatPrice(totalPrice)}
                </p>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Payment Method Selector */}
            <div className="flex rounded-xl bg-neutral-100 p-1">
              <button
                type="button"
                onClick={() => setPaymentMethod("card")}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  paymentMethod === "card"
                    ? "bg-white text-black shadow-xs"
                    : "text-neutral-500 hover:text-black"
                }`}
              >
                Debit / Credit Card
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod("upi")}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  paymentMethod === "upi"
                    ? "bg-white text-black shadow-xs"
                    : "text-neutral-500 hover:text-black"
                }`}
              >
                UPI (GPay / PhonePe / Paytm)
              </button>
            </div>

            {/* Payment Fields */}
            <div className="space-y-3">
              {paymentMethod === "card" ? (
                <>
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 block mb-1">
                      Card information
                    </label>
                    <div className="border border-neutral-200 rounded-xl overflow-hidden divide-y divide-neutral-200 focus-within:border-black transition-colors">
                      <div className="flex items-center px-3.5 py-2.5 bg-white">
                        <CreditCard className="w-4 h-4 text-neutral-400 mr-2 shrink-0" />
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          placeholder="Card number"
                          required
                          className="w-full text-xs font-medium focus:outline-none"
                        />
                        <span className="text-[10px] font-bold bg-neutral-100 text-neutral-600 px-1.5 py-0.5 rounded">
                          TEST
                        </span>
                      </div>
                      <div className="grid grid-cols-2 divide-x divide-neutral-200 bg-white">
                        <input
                          type="text"
                          value={expiry}
                          onChange={(e) => setExpiry(e.target.value)}
                          placeholder="MM / YY"
                          required
                          className="px-3.5 py-2.5 text-xs font-medium focus:outline-none"
                        />
                        <input
                          type="text"
                          value={cvc}
                          onChange={(e) => setCvc(e.target.value)}
                          placeholder="CVC"
                          required
                          className="px-3.5 py-2.5 text-xs font-medium focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 block mb-1">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      value={nameOnCard}
                      onChange={(e) => setNameOnCard(e.target.value)}
                      placeholder="Name on card"
                      required
                      className="w-full px-3.5 py-2.5 border border-neutral-200 rounded-xl text-xs font-medium focus:outline-none focus:border-black transition-colors"
                    />
                  </div>
                </>
              ) : (
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 block mb-1">
                    Virtual Payment Address (VPA / UPI ID)
                  </label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="e.g. mobile@upi or username@okhdfcbank"
                    required
                    className="w-full px-3.5 py-2.5 border border-neutral-200 rounded-xl text-xs font-medium focus:outline-none focus:border-black transition-colors"
                  />
                  <p className="text-[10px] text-neutral-400 mt-1">
                    Supports Google Pay, PhonePe, Paytm, BHIM, and bank UPI apps.
                  </p>
                </div>
              )}

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 block mb-1">
                  Note to host (optional)
                </label>
                <input
                  type="text"
                  value={guestNote}
                  onChange={(e) => setGuestNote(e.target.value)}
                  placeholder="Tell the host about your trip..."
                  className="w-full px-3.5 py-2.5 border border-neutral-200 rounded-xl text-xs font-medium focus:outline-none focus:border-black transition-colors"
                />
              </div>
            </div>

            {/* Security Badge & Pay Button */}
            <div className="pt-2 space-y-3">
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-black text-white py-3.5 rounded-2xl text-xs font-bold hover:bg-neutral-800 disabled:opacity-50 transition-all flex items-center justify-center gap-2 active:scale-[0.99] shadow-md"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing transactional reservation...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    <span>Pay {formatPrice(totalPrice)} & Confirm</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-neutral-400">
                <Lock className="w-3 h-3" />
                <span>256-bit encrypted end-to-end payment simulation</span>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
