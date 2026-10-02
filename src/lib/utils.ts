import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, differenceInDays } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number, currency: string = "INR"): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDateRange(start: Date | string, end: Date | string): string {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const startMonth = format(startDate, "MMM d");
  const endMonth = format(endDate, startDate.getMonth() === endDate.getMonth() ? "d, yyyy" : "MMM d, yyyy");
  return `${startMonth} – ${endMonth}`;
}

export function calculateNights(start: Date | string, end: Date | string): number {
  const diff = differenceInDays(new Date(end), new Date(start));
  return Math.max(diff, 1);
}
