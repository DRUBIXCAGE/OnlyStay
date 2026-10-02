"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { 
  Search, 
  SlidersHorizontal, 
  Menu, 
  User, 
  PlusCircle, 
  CheckCircle2, 
  Compass, 
  Luggage, 
  LayoutDashboard,
  ShieldCheck,
  ChevronDown
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useUIStore } from "@/lib/store";

export function Header() {
  const router = useRouter();
  const { user, role, switchRole, setUser, allUsers } = useAuth();
  const { openSearchModal, openFiltersModal, filters } = useUIStore();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const isHost = role === "HOST";

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-200/80 bg-white/95 backdrop-blur-md transition-all">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-8 h-20 flex items-center justify-between gap-4">
        {/* Typographic Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center font-bold tracking-tighter text-sm transition-transform group-hover:scale-105">
            OS
          </div>
          <span className="font-extrabold text-xl tracking-tight text-neutral-900 group-hover:text-black transition-colors">
            ONLYSTAY
          </span>
        </Link>

        {/* Center Pill Search Trigger */}
        <div
          onClick={openSearchModal}
          className="hidden md:flex items-center divide-x divide-neutral-200 border border-neutral-200/90 rounded-full px-4 py-2 shadow-xs hover:shadow-md cursor-pointer transition-all duration-200 hover:border-neutral-300"
        >
          <div className="px-3 text-xs font-bold text-neutral-900">
            {filters.location || "Anywhere in India"}
          </div>
          <div className="px-3 text-xs font-semibold text-neutral-600">
            {filters.checkIn ? "Dates chosen" : "Single-click Dates"}
          </div>
          <div className="pl-3 pr-1 text-xs font-medium text-neutral-500 flex items-center gap-2.5">
            <span>
              {filters.guests && filters.guests > 1 ? `${filters.guests} guests` : "Guests"}
            </span>
            <div className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center">
              <Search className="w-3 h-3 stroke-[2.5]" />
            </div>
          </div>
        </div>

        {/* Mobile Search Bar Trigger */}
        <div
          onClick={openSearchModal}
          className="flex md:hidden flex-1 items-center gap-3 border border-neutral-200 rounded-full px-4 py-2.5 shadow-sm bg-neutral-50/50"
        >
          <Search className="w-4 h-4 text-neutral-700" />
          <div className="flex flex-col text-left">
            <span className="text-xs font-bold text-neutral-900">
              {filters.location || "Where to?"}
            </span>
            <span className="text-[11px] text-neutral-500">Anywhere · Any week</span>
          </div>
        </div>

        {/* Right Section Actions & User Switcher */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mode Switcher */}
          <button
            onClick={() => switchRole(isHost ? "GUEST" : "HOST")}
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-full border border-neutral-200 hover:bg-neutral-100 transition-colors"
          >
            {isHost ? "Switch to Guest" : "Switch to Host"}
          </button>

          {isHost ? (
            <Link
              href="/host/new"
              className="inline-flex items-center gap-1.5 text-xs font-medium px-3.5 py-2 rounded-full bg-black text-white hover:bg-neutral-800 transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>List stay</span>
            </Link>
          ) : (
            <Link
              href="/trips"
              className="hidden lg:inline-flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-full text-neutral-700 hover:bg-neutral-100 transition-colors"
            >
              <Luggage className="w-3.5 h-3.5" />
              <span>My Trips</span>
            </Link>
          )}

          {/* User Profile & Demo Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 border border-neutral-200/90 rounded-full p-1 pl-3 hover:shadow-sm hover:border-neutral-300 transition-all bg-white"
            >
              <Menu className="w-4 h-4 text-neutral-600" />
              <div className="relative w-8 h-8 rounded-full overflow-hidden bg-neutral-100 border border-neutral-200">
                {user?.image ? (
                  <img
                    src={user.image}
                    alt={user.name || "User"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-4 h-4 m-auto text-neutral-500" />
                )}
              </div>
            </button>

            {/* Dropdown Menu */}
            {isUserMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsUserMenuOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-neutral-200 p-2 z-50 animate-zoom-in">
                  {/* Current Active User Banner */}
                  <div className="p-3 border-b border-neutral-100 bg-neutral-50/70 rounded-xl mb-2">
                    <div className="flex items-center gap-3">
                      <img
                        src={user?.image || ""}
                        alt={user?.name || ""}
                        className="w-10 h-10 rounded-full object-cover border border-neutral-200"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1">
                          <p className="text-sm font-bold text-neutral-900 truncate">
                            {user?.name}
                          </p>
                          {user?.isHostVerified && (
                            <ShieldCheck className="w-3.5 h-3.5 text-neutral-900 shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-neutral-500 truncate">{user?.email}</p>
                        <span className="inline-block mt-0.5 text-[10px] font-bold tracking-wider px-1.5 py-0.5 rounded bg-neutral-200/70 text-neutral-800 uppercase">
                          {role} MODE
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Navigation Links */}
                  <div className="space-y-1">
                    <Link
                      href="/"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
                    >
                      <Compass className="w-4 h-4" />
                      <span>Explore Stays</span>
                    </Link>

                    <Link
                      href="/trips"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
                    >
                      <Luggage className="w-4 h-4" />
                      <span>My Trips & Bookings</span>
                    </Link>

                    <Link
                      href="/host/dashboard"
                      onClick={() => {
                        switchRole("HOST");
                        setIsUserMenuOpen(false);
                      }}
                      className="flex items-center gap-2.5 px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      <span>Host Dashboard</span>
                    </Link>

                    <Link
                      href="/host/new"
                      onClick={() => {
                        switchRole("HOST");
                        setIsUserMenuOpen(false);
                      }}
                      className="flex items-center gap-2.5 px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span>List a new stay</span>
                    </Link>
                  </div>

                  {/* Quick User Switcher for Evaluator/Testing */}
                  <div className="mt-2 pt-2 border-t border-neutral-100">
                    <p className="px-3 py-1 text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                      Switch Demo Profile
                    </p>
                    <div className="space-y-1">
                      {allUsers.map((u) => (
                        <button
                          key={u.id}
                          onClick={() => {
                            setUser(u);
                            setIsUserMenuOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-1.5 text-xs rounded-lg transition-colors ${
                            user?.id === u.id
                              ? "bg-neutral-900 text-white font-semibold"
                              : "text-neutral-700 hover:bg-neutral-100"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="truncate">{u.name}</span>
                            <span className="text-[10px] opacity-70">
                              ({u.role})
                            </span>
                          </div>
                          {user?.id === u.id && (
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
