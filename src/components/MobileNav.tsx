"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Luggage, PlusCircle, LayoutDashboard, User } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export function MobileNav() {
  const pathname = usePathname();
  const { role, switchRole } = useAuth();
  const isHost = role === "HOST";

  const navItems = [
    {
      label: "Explore",
      href: "/",
      icon: Search,
      active: pathname === "/",
    },
    {
      label: "My Trips",
      href: "/trips",
      icon: Luggage,
      active: pathname === "/trips",
    },
    {
      label: isHost ? "Dashboard" : "Host Stay",
      href: isHost ? "/host/dashboard" : "/host/new",
      icon: isHost ? LayoutDashboard : PlusCircle,
      active: pathname.startsWith("/host"),
    },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-neutral-200/90 py-2 px-6 flex items-center justify-around shadow-lg">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.label}
            href={item.href}
            className={`flex flex-col items-center gap-1 text-[10px] font-bold transition-colors ${
              item.active ? "text-black" : "text-neutral-400 hover:text-neutral-700"
            }`}
          >
            <Icon className={`w-5 h-5 ${item.active ? "stroke-[2.5]" : "stroke-[1.8]"}`} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
