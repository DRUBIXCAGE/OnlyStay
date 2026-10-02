"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Lock, Unlock, Loader2, Calendar as CalendarIcon, Check } from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isBefore, startOfToday } from "date-fns";

interface HostCalendarProps {
  listingId: string;
}

export function HostCalendar({ listingId }: HostCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [blockedDates, setBlockedDates] = useState<Date[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionPendingDate, setActionPendingDate] = useState<string | null>(null);

  const fetchAvailability = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/listings/${listingId}/availability`);
      const data = await res.json();
      if (res.ok) {
        setBlockedDates((data.blockedDates || []).map((b: any) => new Date(b.date)));
        setBookings(data.bookings || []);
      }
    } catch (e) {
      console.error("Failed to load availability", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (listingId) {
      fetchAvailability();
    }
  }, [listingId]);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const today = startOfToday();

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const isDateBlocked = (date: Date) => {
    return blockedDates.some((b) => isSameDay(b, date));
  };

  const getBookingForDate = (date: Date) => {
    return bookings.find((b) => {
      const start = new Date(b.startDate);
      const end = new Date(b.endDate);
      return date >= start && date < end;
    });
  };

  const toggleDateBlock = async (date: Date) => {
    if (isBefore(date, today)) return; // Don't block past dates
    const dateStr = date.toISOString();
    setActionPendingDate(dateStr);

    const currentlyBlocked = isDateBlocked(date);
    const action = currentlyBlocked ? "unblock" : "block";

    try {
      const res = await fetch(`/api/listings/${listingId}/availability`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: dateStr,
          action,
          reason: "Host calendar toggle",
        }),
      });

      if (res.ok) {
        if (action === "block") {
          setBlockedDates((prev) => [...prev, date]);
        } else {
          setBlockedDates((prev) => prev.filter((b) => !isSameDay(b, date)));
        }
      }
    } catch (e) {
      console.error("Failed to toggle date block", e);
    } finally {
      setActionPendingDate(null);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-neutral-200 p-6 space-y-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-neutral-900 flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-neutral-800" />
            <span>Availability & Pricing Calendar</span>
          </h3>
          <p className="text-xs text-neutral-500">
            Click any open date to block or unblock reservations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-neutral-800 mr-2">
            {format(currentMonth, "MMMM yyyy")}
          </span>
          <button
            onClick={prevMonth}
            className="p-1.5 rounded-full border border-neutral-200 hover:bg-neutral-100 transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-neutral-600" />
          </button>
          <button
            onClick={nextMonth}
            className="p-1.5 rounded-full border border-neutral-200 hover:bg-neutral-100 transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-neutral-600" />
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-white border border-neutral-300" />
          <span className="text-neutral-600">Available</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-neutral-900" />
          <span className="text-neutral-600">Booked Stay</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-neutral-200 border border-neutral-300" />
          <span className="text-neutral-600">Blocked by Host</span>
        </div>
      </div>

      {/* Calendar Grid */}
      {isLoading ? (
        <div className="h-64 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
        </div>
      ) : (
        <div className="grid grid-cols-7 gap-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="text-center text-[10px] font-bold uppercase tracking-wider text-neutral-400 py-1"
            >
              {day}
            </div>
          ))}

          {days.map((day) => {
            const isPast = isBefore(day, today);
            const blocked = isDateBlocked(day);
            const booking = getBookingForDate(day);
            const isPending = actionPendingDate === day.toISOString();

            let statusClasses = "bg-white text-neutral-900 hover:border-black hover:bg-neutral-50";
            if (isPast) {
              statusClasses = "bg-neutral-50 text-neutral-300 cursor-not-allowed border-transparent";
            } else if (booking) {
              statusClasses = "bg-black text-white font-bold cursor-default border-black";
            } else if (blocked) {
              statusClasses = "bg-neutral-200 text-neutral-500 border-neutral-300 hover:bg-neutral-300 line-through";
            }

            return (
              <button
                key={day.toISOString()}
                disabled={isPast || !!booking || isPending}
                onClick={() => toggleDateBlock(day)}
                className={`relative h-14 rounded-xl border flex flex-col items-center justify-center transition-all ${statusClasses}`}
              >
                {isPending ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <>
                    <span className="text-xs font-semibold">{format(day, "d")}</span>
                    {booking && (
                      <span className="text-[9px] font-medium tracking-tight truncate max-w-[90%] opacity-90">
                        {booking.guest?.name || "Booked"}
                      </span>
                    )}
                    {blocked && (
                      <span className="text-[9px] font-semibold text-neutral-600">
                        Blocked
                      </span>
                    )}
                  </>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
