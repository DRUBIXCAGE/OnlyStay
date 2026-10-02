import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding ONLYSTAY Indian Domestic database...");

  // Clean existing data
  await prisma.review.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.blockedDate.deleteMany();
  await prisma.listingAmenity.deleteMany();
  await prisma.listingImage.deleteMany();
  await prisma.listing.deleteMany();
  await prisma.user.deleteMany();

  // Create Users: Indian Hosts and Guests
  const host1 = await prisma.user.create({
    data: {
      id: "host_ananya",
      name: "Ananya Deshmukh",
      email: "ananya@onlystay.in",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
      bio: "Sustainable architect & restoration specialist in Assagao, Goa and Alibaug. Passionate about laterite stone and open courtyard living.",
      role: "HOST",
      isHostVerified: true,
      phone: "+91 98201 23456",
    },
  });

  const host2 = await prisma.user.create({
    data: {
      id: "host_vikram",
      name: "Vikramaditya Rathore",
      email: "vikram@onlystay.in",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
      bio: "Heritage custodian restoring 200-year-old Rajputana stone havelis along Lake Pichola, Udaipur and Jaipur.",
      role: "HOST",
      isHostVerified: true,
      phone: "+91 98290 87654",
    },
  });

  const host3 = await prisma.user.create({
    data: {
      id: "host_rohan",
      name: "Rohan & Meera Nambiar",
      email: "rohan@onlystay.in",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
      bio: "Fourth-generation estate planters and architects crafting teak sanctuaries in Kumarakom, Kerala and Coorg.",
      role: "HOST",
      isHostVerified: true,
      phone: "+91 94471 23489",
    },
  });

  const host4 = await prisma.user.create({
    data: {
      id: "host_tenzing",
      name: "Tenzing Norbu",
      email: "tenzing@onlystay.in",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
      bio: "High-altitude eco builder preserving Himalayan rock and deodar timber architecture in Manali, Rishikesh, and Ladakh.",
      role: "HOST",
      isHostVerified: true,
      phone: "+91 98160 54321",
    },
  });

  const guest1 = await prisma.user.create({
    data: {
      id: "guest_aarav",
      name: "Aarav Sharma",
      email: "aarav@sharma.in",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80",
      bio: "Design tech founder & architectural explorer based between Bengaluru and Mumbai. Connoisseur of heritage havelis and cliffside coastal homes.",
      role: "GUEST",
      isHostVerified: true,
      phone: "+91 98450 11223",
    },
  });

  const listingsData = [
    {
      id: "stay_goa_assagao_villa",
      hostId: host1.id,
      title: "Portuguese Heritage Villa & Frangipani Courtyard",
      description: "An exquisite 180-year-old Indo-Portuguese sanctuary tucked amidst Assagao's lush banyan canopies. Built with hand-cut red laterite stone, mother-of-pearl oyster shell windows, vaulted teak ceilings, private turquoise lap pool, and an open-air central courtyard framed by blooming frangipani trees.",
      propertyType: "Entire home",
      roomType: "entire",
      category: "Architectural",
      address: "Chogm Road, Assagao, North Goa",
      city: "Goa",
      country: "India",
      lat: 15.5898,
      lng: 73.7744,
      pricePerNight: 18500,
      weekendSurge: 2500,
      cleaningFee: 1500,
      serviceFee: 1200,
      maxGuests: 6,
      bedrooms: 3,
      beds: 3,
      baths: 3.5,
      isPublished: true,
      instantBookable: true,
      minNights: 2,
      cancellationPolicy: "FLEXIBLE",
      rating: 4.98,
      reviewCount: 54,
      images: [
        "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=80",
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80",
      ],
      amenities: ["wifi", "pool", "kitchen", "ac", "workspace", "parking", "garden", "hot_tub"],
    },
    {
      id: "stay_udaipur_pichola_haveli",
      hostId: host2.id,
      title: "Lake Pichola Marble Haveli Suite",
      description: "A rare restored waterfront haveli directly on the tranquil waters of Lake Pichola. Features intricate jharokha stone balconies, Makrana white marble floors, private rooftop plunge pool overlooking the illuminated City Palace, and centuries-old Mewari fresco work.",
      propertyType: "Entire home",
      roomType: "entire",
      category: "Architectural",
      address: "Lal Ghat, Old City, Udaipur",
      city: "Udaipur",
      country: "India",
      lat: 24.5764,
      lng: 73.6835,
      pricePerNight: 24000,
      weekendSurge: 3500,
      cleaningFee: 2000,
      serviceFee: 1800,
      maxGuests: 4,
      bedrooms: 2,
      beds: 2,
      baths: 2.5,
      isPublished: true,
      instantBookable: true,
      minNights: 2,
      cancellationPolicy: "MODERATE",
      rating: 4.99,
      reviewCount: 68,
      images: [
        "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1600&q=80",
        "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80",
      ],
      amenities: ["wifi", "hot_tub", "pool", "ac", "workspace", "kitchen", "ocean_view"],
    },
    {
      id: "stay_jaipur_sandstone_kothi",
      hostId: host2.id,
      title: "Pink City Royal Sandstone Kothi",
      description: "An art-deco meets Rajputana monolithic sandstone residence designed by master craftsmen. Soaring 14-foot arches, terrazzo flooring, lush pomegranate gardens, private heated pool, and bespoke brass metalwork. Walk to royal parks and artisan bazaars.",
      propertyType: "Entire home",
      roomType: "entire",
      category: "Architectural",
      address: "Jacob Road, Civil Lines, Jaipur",
      city: "Jaipur",
      country: "India",
      lat: 26.9124,
      lng: 75.7873,
      pricePerNight: 16500,
      weekendSurge: 2000,
      cleaningFee: 1500,
      serviceFee: 1100,
      maxGuests: 4,
      bedrooms: 2,
      beds: 2,
      baths: 2.0,
      isPublished: true,
      instantBookable: true,
      minNights: 2,
      cancellationPolicy: "FLEXIBLE",
      rating: 4.96,
      reviewCount: 44,
      images: [
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80",
        "https://images.unsplash.com/photo-1502005229762-ee1b2b8ab00f?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1616137466211-f939a420be84?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
      ],
      amenities: ["wifi", "pool", "kitchen", "ac", "workspace", "parking", "garden"],
    },
    {
      id: "stay_manali_cedar_chalet",
      hostId: host4.id,
      title: "Himalayan Handcrafted Cedarwood Chalet",
      description: "Suspended above organic apple orchards overlooking snow-capped Pir Panjal peaks. Built entirely with sustainable deodar wood and river rock masonry. Features an indoor stone fireplace, panoramic glass sunroom, and cedar soaking tub under pine-scented breezes.",
      propertyType: "Entire home",
      roomType: "entire",
      category: "Alpine",
      address: "Club House Road, Old Manali, Himachal Pradesh",
      city: "Manali",
      country: "India",
      lat: 32.2432,
      lng: 77.1892,
      pricePerNight: 12500,
      weekendSurge: 1800,
      cleaningFee: 1200,
      serviceFee: 900,
      maxGuests: 4,
      bedrooms: 2,
      beds: 2,
      baths: 2.0,
      isPublished: true,
      instantBookable: true,
      minNights: 2,
      cancellationPolicy: "FLEXIBLE",
      rating: 4.97,
      reviewCount: 61,
      images: [
        "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1600&q=80",
        "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      ],
      amenities: ["wifi", "fireplace", "mountain_view", "kitchen", "workspace", "hot_tub", "parking"],
    },
    {
      id: "stay_kerala_teak_waterfront",
      hostId: host3.id,
      title: "Vembanad Backwaters Teak Sanctuary",
      description: "A traditional Kerala Nalukettu timber pavilion set on the lotus-strewn banks of Vembanad Lake. Centuries-old hand-carved teak pillars, open-to-sky shower courtyard, private lotus infinity pool, and personal wooden canoe dock for sunrise excursions.",
      propertyType: "Entire home",
      roomType: "entire",
      category: "Seaside",
      address: "Kavanattinkara, Kumarakom, Kerala",
      city: "Kerala",
      country: "India",
      lat: 9.6175,
      lng: 76.4301,
      pricePerNight: 15000,
      weekendSurge: 2200,
      cleaningFee: 1400,
      serviceFee: 1100,
      maxGuests: 4,
      bedrooms: 2,
      beds: 2,
      baths: 2.0,
      isPublished: true,
      instantBookable: true,
      minNights: 2,
      cancellationPolicy: "FLEXIBLE",
      rating: 4.98,
      reviewCount: 58,
      images: [
        "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1600&q=80",
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      ],
      amenities: ["wifi", "pool", "kitchen", "ac", "ocean_view", "balcony", "parking"],
    },
    {
      id: "stay_pondicherry_french_villa",
      hostId: host1.id,
      title: "French Colonial Maison & Sunlit Courtyard",
      description: "Sun-drenched Franco-Tamil residence built in 1890 with mustard lime-plastered walls, terracotta tile roofs, high louvred shuttered windows, and a tranquil frangipani courtyard two blocks from the Bay of Bengal promenade.",
      propertyType: "Entire home",
      roomType: "entire",
      category: "Minimalist",
      address: "Rue Romain Rolland, White Town, Pondicherry",
      city: "Pondicherry",
      country: "India",
      lat: 11.9340,
      lng: 79.8306,
      pricePerNight: 9800,
      weekendSurge: 1500,
      cleaningFee: 1000,
      serviceFee: 750,
      maxGuests: 4,
      bedrooms: 2,
      beds: 2,
      baths: 2.0,
      isPublished: true,
      instantBookable: true,
      minNights: 1,
      cancellationPolicy: "FLEXIBLE",
      rating: 4.95,
      reviewCount: 49,
      images: [
        "https://images.unsplash.com/photo-1502005229762-ee1b2b8ab00f?auto=format&fit=crop&w=1600&q=80",
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
      ],
      amenities: ["wifi", "ac", "kitchen", "workspace", "balcony", "washer"],
    },
    {
      id: "stay_rishikesh_ganges_villa",
      hostId: host4.id,
      title: "Ganges Cliffside Meditation Retreat",
      description: "Perched dramatically above the turquoise waters of the sacred Ganges river with uninterrupted Himalayan valley vistas. Triple-glazed sliding glass walls, rooftop yoga deck, raw slate bathrooms, and private river path for quiet contemplation.",
      propertyType: "Entire home",
      roomType: "entire",
      category: "Alpine",
      address: "Badrinath Road, Tapovan, Rishikesh",
      city: "Rishikesh",
      country: "India",
      lat: 30.0869,
      lng: 78.2676,
      pricePerNight: 14000,
      weekendSurge: 2000,
      cleaningFee: 1200,
      serviceFee: 950,
      maxGuests: 4,
      bedrooms: 2,
      beds: 2,
      baths: 2.0,
      isPublished: true,
      instantBookable: true,
      minNights: 2,
      cancellationPolicy: "FLEXIBLE",
      rating: 4.99,
      reviewCount: 73,
      images: [
        "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1600&q=80",
        "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
      ],
      amenities: ["wifi", "mountain_view", "workspace", "kitchen", "balcony", "yoga_deck", "parking"],
    },
    {
      id: "stay_coorg_coffee_estate",
      hostId: host3.id,
      title: "Mist & Wood: Coffee Estate Glasshouse",
      description: "Nestled within an organic 40-acre Arabica coffee and black pepper plantation. Steel-and-glass cantilevered architecture floating among silver oak canopies with outdoor hot tub, fire pit, and estate-roasted coffee bar.",
      propertyType: "Entire home",
      roomType: "entire",
      category: "Architectural",
      address: "Siddapur Road, Madikeri, Coorg",
      city: "Coorg",
      country: "India",
      lat: 12.4244,
      lng: 75.7382,
      pricePerNight: 11500,
      weekendSurge: 1600,
      cleaningFee: 1000,
      serviceFee: 850,
      maxGuests: 4,
      bedrooms: 2,
      beds: 2,
      baths: 2.0,
      isPublished: true,
      instantBookable: true,
      minNights: 2,
      cancellationPolicy: "FLEXIBLE",
      rating: 4.96,
      reviewCount: 52,
      images: [
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80",
        "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80",
      ],
      amenities: ["wifi", "hot_tub", "fireplace", "workspace", "kitchen", "mountain_view", "parking"],
    },
    {
      id: "stay_alibaug_brutalist_pavilion",
      hostId: host1.id,
      title: "The Monolith: Coastal Brutalist Pavilion",
      description: "A striking minimalist raw concrete villa just 20 minutes by speedboat from Mumbai's Gateway of India. Surrounded by swaying coconut palms, 25-meter black granite lap pool, monolithic open pavilion, and private beach trail.",
      propertyType: "Entire home",
      roomType: "entire",
      category: "Minimalist",
      address: "Awas Beach Road, Alibaug, Maharashtra",
      city: "Alibaug",
      country: "India",
      lat: 18.6414,
      lng: 72.8722,
      pricePerNight: 28000,
      weekendSurge: 4500,
      cleaningFee: 2500,
      serviceFee: 2200,
      maxGuests: 6,
      bedrooms: 3,
      beds: 3,
      baths: 3.5,
      isPublished: true,
      instantBookable: true,
      minNights: 2,
      cancellationPolicy: "STRICT",
      rating: 4.98,
      reviewCount: 66,
      images: [
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1600&q=80",
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80",
      ],
      amenities: ["wifi", "pool", "ac", "kitchen", "workspace", "parking", "ev_charger", "ocean_view"],
    },
    {
      id: "stay_ladakh_eco_stone",
      hostId: host4.id,
      title: "Nubra Valley Monolithic Earth & Stone Lodge",
      description: "A passive-solar architectural triumph sculpted from local granite boulders and rammed earth under the Karakoram Range. Stargazing glass skylights, radiant floor heating, Tibetan brass soaking tub, and cosmic dark-sky silence.",
      propertyType: "Entire home",
      roomType: "entire",
      category: "Desert",
      address: "Diskit Village, Nubra Valley, Ladakh",
      city: "Ladakh",
      country: "India",
      lat: 34.1526,
      lng: 77.5771,
      pricePerNight: 19500,
      weekendSurge: 2500,
      cleaningFee: 1800,
      serviceFee: 1400,
      maxGuests: 4,
      bedrooms: 2,
      beds: 2,
      baths: 2.0,
      isPublished: true,
      instantBookable: true,
      minNights: 2,
      cancellationPolicy: "MODERATE",
      rating: 4.99,
      reviewCount: 39,
      images: [
        "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1600&q=80",
        "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
      ],
      amenities: ["wifi", "mountain_view", "fireplace", "hot_tub", "kitchen", "parking"],
    },
  ];

  for (const item of listingsData) {
    const { images, amenities, ...listingFields } = item;

    const createdListing = await prisma.listing.create({
      data: {
        ...listingFields,
        images: {
          create: images.map((url, index) => ({
            url,
            orderIndex: index,
            caption: `${item.title} - View ${index + 1}`,
          })),
        },
        amenities: {
          create: amenities.map((key) => ({
            amenityKey: key,
          })),
        },
      },
    });

    // Add 2 reviews per stay
    await prisma.review.create({
      data: {
        listingId: createdListing.id,
        authorId: guest1.id,
        rating: 5.0,
        cleanlinessRating: 5.0,
        accuracyRating: 5.0,
        communicationRating: 5.0,
        locationRating: 5.0,
        checkinRating: 5.0,
        valueRating: 5.0,
        comment: "Breathtaking architectural curation. The balance of indigenous materials and modern minimalist comfort was exceptional. One of the finest stays in India.",
      },
    });

    await prisma.review.create({
      data: {
        listingId: createdListing.id,
        authorId: host1.id,
        rating: 4.9,
        cleanlinessRating: 5.0,
        accuracyRating: 5.0,
        communicationRating: 4.8,
        locationRating: 5.0,
        checkinRating: 5.0,
        valueRating: 4.8,
        comment: "Flawless hospitality and architectural tranquility. Highly recommended for mindful travelers.",
      },
    });

    // Add sample blocked dates 2 weeks out
    const today = new Date();
    const blockedDate1 = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 14);
    const blockedDate2 = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 15);
    await prisma.blockedDate.create({
      data: {
        listingId: createdListing.id,
        date: blockedDate1,
        reason: "Reserved by owner for private retreat",
      },
    });
    await prisma.blockedDate.create({
      data: {
        listingId: createdListing.id,
        date: blockedDate2,
        reason: "Reserved by owner for private retreat",
      },
    });
  }

  // Create sample past booking for guest Aarav Sharma
  await prisma.booking.create({
    data: {
      listingId: "stay_goa_assagao_villa",
      guestId: guest1.id,
      startDate: new Date(2026, 8, 10),
      endDate: new Date(2026, 8, 14),
      nights: 4,
      guestsCount: 2,
      pricePerNight: 18500,
      cleaningFee: 1500,
      serviceFee: 1200,
      totalPrice: 76700,
      status: "COMPLETED",
      isInstant: true,
      paymentStatus: "PAID",
      stripePaymentId: "upi_pay_live_aarav_001",
      guestNote: "Quiet architectural research getaway in Assagao.",
    },
  });

  // Create an upcoming booking
  const upcomingStart = new Date();
  upcomingStart.setDate(upcomingStart.getDate() + 10);
  const upcomingEnd = new Date();
  upcomingEnd.setDate(upcomingEnd.getDate() + 13);

  await prisma.booking.create({
    data: {
      listingId: "stay_udaipur_pichola_haveli",
      guestId: guest1.id,
      startDate: upcomingStart,
      endDate: upcomingEnd,
      nights: 3,
      guestsCount: 2,
      pricePerNight: 24000,
      cleaningFee: 2000,
      serviceFee: 1800,
      totalPrice: 75800,
      status: "CONFIRMED",
      isInstant: true,
      paymentStatus: "PAID",
      stripePaymentId: "upi_pay_live_aarav_002",
      guestNote: "Looking forward to sunsets over Lake Pichola.",
    },
  });

  console.log("Successfully seeded 10 domestic Indian architectural stays, hosts, reviews, and bookings in INR!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
