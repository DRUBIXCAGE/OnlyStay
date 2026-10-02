import React from "react";
import Link from "next/link";
import { Globe, DollarSign } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-neutral-200 bg-neutral-50/60 text-neutral-600 text-xs py-12 px-4 sm:px-8 mt-20 transition-all">
      <div className="max-w-[1720px] mx-auto space-y-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <h4 className="font-bold text-neutral-900 tracking-tight text-xs uppercase">
              ONLYSTAY Architecture
            </h4>
            <ul className="space-y-2 text-neutral-500">
              <li><Link href="/" className="hover:text-black transition-colors">Heritage Havelis & Palaces</Link></li>
              <li><Link href="/" className="hover:text-black transition-colors">Goan Portuguese Villas</Link></li>
              <li><Link href="/" className="hover:text-black transition-colors">Himalayan Cedar Chalets</Link></li>
              <li><Link href="/" className="hover:text-black transition-colors">Kerala Backwater Teak Mansions</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-neutral-900 tracking-tight text-xs uppercase">
              Hosting
            </h4>
            <ul className="space-y-2 text-neutral-500">
              <li><Link href="/host/new" className="hover:text-black transition-colors">List your architectural stay</Link></li>
              <li><Link href="/host/dashboard" className="hover:text-black transition-colors">Host dashboard & calendar</Link></li>
              <li><Link href="/host/dashboard" className="hover:text-black transition-colors">Host Protection & Guarantee</Link></li>
              <li><Link href="/host/dashboard" className="hover:text-black transition-colors">Community standards</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-neutral-900 tracking-tight text-xs uppercase">
              Discovery
            </h4>
            <ul className="space-y-2 text-neutral-500">
              <li><Link href="/trips" className="hover:text-black transition-colors">My reservations</Link></li>
              <li><Link href="/" className="hover:text-black transition-colors">Instant Book stays</Link></li>
              <li><Link href="/" className="hover:text-black transition-colors">Curated editorial</Link></li>
              <li><Link href="/" className="hover:text-black transition-colors">Gift cards & credits</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-neutral-900 tracking-tight text-xs uppercase">
              Standard
            </h4>
            <ul className="space-y-2 text-neutral-500">
              <li><span className="hover:text-black cursor-pointer">Privacy Policy</span></li>
              <li><span className="hover:text-black cursor-pointer">Terms of Service</span></li>
              <li><span className="hover:text-black cursor-pointer">Security & Encryption</span></li>
              <li><span className="hover:text-black cursor-pointer">Sitemap</span></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-black tracking-tighter text-black">OS</span>
            <span>© {new Date().getFullYear()} ONLYSTAY India Technologies Pvt. Ltd. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6 font-semibold text-neutral-800">
            <div className="flex items-center gap-1.5 cursor-pointer hover:underline">
              <Globe className="w-3.5 h-3.5" />
              <span>English (IN)</span>
            </div>
            <div className="flex items-center gap-1 cursor-pointer hover:underline">
              <span className="font-bold">₹</span>
              <span>INR</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
