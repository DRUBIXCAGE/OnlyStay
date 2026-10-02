import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Header } from "@/components/Header";
import { MobileNav } from "@/components/MobileNav";
import { Footer } from "@/components/Footer";
import { SearchModal } from "@/components/SearchModal";
import { FiltersModal } from "@/components/FiltersModal";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ONLYSTAY — Minimalist Architectural Stays & Sanctuaries",
  description:
    "Discover and book monolithic homes, Nordic canal lofts, historic Kyoto machiyas, and architectural retreats designed for pure living.",
  keywords: [
    "minimalist architecture",
    "boutique stays",
    "luxury villa rentals",
    "machiya kyoto",
    "design hotels",
    "airbnb alternative",
  ],
  authors: [{ name: "ONLYSTAY Design Team" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen flex flex-col bg-white text-neutral-900 selection:bg-neutral-900 selection:text-white pb-16 md:pb-0 font-sans">
        <Providers>
          <Header />
          <main className="flex-1 w-full">{children}</main>
          <Footer />
          <MobileNav />
          <SearchModal />
          <FiltersModal />
        </Providers>
      </body>
    </html>
  );
}
