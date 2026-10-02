# ONLYSTAY — Ultra-Minimalist Architectural Stays & Sanctuaries

ONLYSTAY is a modern, production-grade room and property booking platform inspired by Airbnb, engineered with clean architecture, strict TypeScript safety, and an ultra-minimalist, typographic-first design system.

---

## 🏛️ Architectural Highlights & Features

### 1. Discovery & Search Engine (`/`)
- **Header Search Pill**: Destination autocomplete, date range selection, and guest incrementer (`SearchModal`).
- **Dynamic Filter Bar**: Category filtering (*Minimalist, Architectural, Loft, Seaside, Desert, Alpine, Urban*), price range slider, instant book toggle, property type, and amenity checklist (`FiltersModal`).
- **Split-View Results**: Responsive switch between listing cards grid and an interactive Leaflet map with synchronized price pins (`$420`) that highlight upon card hover.

### 2. Listing Detail View (`/rooms/[id]`)
- **Photo Mosaic & Lightbox**: 5-photo geometric grid and fullscreen lightbox modal with keyboard navigation (`ArrowLeft`, `ArrowRight`, `Escape`).
- **Sticky Booking Card**: Live dynamic date calculations (`nights × rate + cleaning fee + service fee = total`).
- **Transactional Date Lock**: Concurrency check preventing overlapping reservations.
- **Stripe Secure Checkout Simulation**: Realistic modal with card input, instant validation, and reservation confirmation.
- **Interactive Neighborhood Map**: Exact radius display with Positron monochrome tiles.
- **Verified Reviews**: 6-axis ratings breakdown (*Cleanliness, Accuracy, Communication, Location, Check-in, Value*) and review submission modal.

### 3. Dual-Role Guest & Host System
- **Quick Profile Switcher**: Switch between Guest (*Elena Vance*) and Verified Hosts (*Marcus Sterling, Kenzo Takeda, Clara Laurent*) directly from the header dropdown.
- **Host Dashboard (`/host/dashboard`)**:
  - Live listing switcher dropdown.
  - Interactive monthly calendar with single-click date blocking/unblocking.
  - Reservation management state machine (`PENDING` → `CONFIRMED` → `CHECKED_IN` → `COMPLETED` / `CANCELED`).
  - Total net earnings, active stays count, and Superhost rating metrics.
- **7-Step Host Listing Creation Wizard (`/host/new`)**:
  - Step 1: Category & Space Access Type
  - Step 2: Location, City, Country, & Latitude/Longitude
  - Step 3: Capacity Specs (Guests, Bedrooms, Beds, Baths)
  - Step 4: Amenities Checklist
  - Step 5: Multi-Photo Uploader & Cover Photo Selection
  - Step 6: Title, Architectural Description, & House Rules
  - Step 7: Pricing, Weekend Surge, Cleaning Fee, & Cancellation Policy
- **Guest Trips Tracker (`/trips`)**:
  - Upcoming and completed stays.
  - Stripe payment receipts with itemized breakdown and transaction reference.
  - Reservation cancellation action.
  - Review launcher for completed trips.

---

## 🛠️ Technology Stack
- **Framework**: Next.js 14+ (App Router, Server Actions, Route Handlers)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS (Custom monochrome palette `#FFFFFF`, `#F7F7F8`, `#E5E7EB`, `#0F172A`, `#000000`)
- **Database & ORM**: PostgreSQL / SQLite with Prisma ORM
- **State Management**: TanStack React Query + Zustand
- **Validation**: Zod (100% type-safe inputs on client and server)
- **Maps**: Leaflet with CartoDB Positron minimalist tiles
- **Icons**: Lucide React

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm.cmd install
```

### 2. Initialize Database & Seed Sample Stays
```bash
npx.cmd prisma db push
npx.cmd tsx prisma/seed.ts
```

### 3. Run Development Server
```bash
npm.cmd run dev
```
Open [http://localhost:3000](http://localhost:3000) (or `http://localhost:3001` if port 3000 is occupied).

### 4. Build for Production
```bash
npm.cmd run build
```

---

## 📊 Database Schema (Prisma)
- **`User`**: Profiles with dual roles (`GUEST`, `HOST`, `ADMIN`) and host verification badges.
- **`Listing`**: Architectural properties with pricing, coordinates, amenities, and policies.
- **`ListingImage`**: High-resolution gallery images with ordering and captions.
- **`ListingAmenity`**: Relational amenity tags.
- **`Booking`**: Transactional reservations with date ranges, pricing breakdown, and status state machine.
- **`BlockedDate`**: Host calendar blackouts.
- **`Review`**: 6-axis verified ratings and traveler comments.
