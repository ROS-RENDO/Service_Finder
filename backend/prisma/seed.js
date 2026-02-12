// prisma/seed.js
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  try {
    // Clear existing data (in reverse order of dependencies)
    console.log("🗑️  Clearing existing data...");
    await prisma.auditLog.deleteMany();
    await prisma.passwordReset.deleteMany();
    await prisma.notification.deleteMany();
    await prisma.companyRatingSummary.deleteMany();
    await prisma.cancellation.deleteMany();
    await prisma.review.deleteMany();
    await prisma.invoice.deleteMany();
    await prisma.payment.deleteMany();
    await prisma.bookingStatusLog.deleteMany();
    await prisma.booking.deleteMany();
    await prisma.availabilitySlot.deleteMany();
    await prisma.serviceArea.deleteMany();
    await prisma.service.deleteMany();
    await prisma.serviceType.deleteMany();
    await prisma.category.deleteMany();
    await prisma.companyStaff.deleteMany();
    await prisma.company.deleteMany();
    await prisma.user.deleteMany();

    // Hash password for all users
    const hashedPassword = await bcrypt.hash("Password123!", 10);

    console.log("👥 Creating users...");

    // ===== USERS =====
    // Admin
    const adminUser = await prisma.user.create({
      data: {
        fullName: "Admin User",
        email: "admin@servicefinder.com",
        phone: "+1-800-ADMIN-01",
        passwordHash: hashedPassword,
        role: "admin",
        status: "active",
      },
    });

    // Company Owners
    const owner1 = await prisma.user.create({
      data: {
        fullName: "John Smith",
        email: "john@cleanpro.com",
        phone: "+1-555-0101",
        passwordHash: hashedPassword,
        role: "company_admin",
        status: "active",
      },
    });

    const owner2 = await prisma.user.create({
      data: {
        fullName: "Sarah Johnson",
        email: "sarah@plumbpro.com",
        phone: "+1-555-0102",
        passwordHash: hashedPassword,
        role: "company_admin",
        status: "active",
      },
    });

    const owner3 = await prisma.user.create({
      data: {
        fullName: "Mike Wilson",
        email: "mike@electrictec.com",
        phone: "+1-555-0103",
        passwordHash: hashedPassword,
        role: "company_admin",
        status: "active",
      },
    });

    // Staff Members
    const staff1 = await prisma.user.create({
      data: {
        fullName: "Robert Brown",
        email: "robert@cleanpro.com",
        phone: "+1-555-0104",
        passwordHash: hashedPassword,
        role: "staff",
        status: "active",
      },
    });

    const staff2 = await prisma.user.create({
      data: {
        fullName: "David Garcia",
        email: "david@cleanpro.com",
        phone: "+1-555-0105",
        passwordHash: hashedPassword,
        role: "staff",
        status: "active",
      },
    });

    const staff3 = await prisma.user.create({
      data: {
        fullName: "Tom Martinez",
        email: "tom@plumbpro.com",
        phone: "+1-555-0106",
        passwordHash: hashedPassword,
        role: "staff",
        status: "active",
      },
    });

    // Customers
    const customer1 = await prisma.user.create({
      data: {
        fullName: "Emma Davis",
        email: "emma@example.com",
        phone: "+1-555-0201",
        passwordHash: hashedPassword,
        role: "customer",
        status: "active",
      },
    });

    const customer2 = await prisma.user.create({
      data: {
        fullName: "Lisa Anderson",
        email: "lisa@example.com",
        phone: "+1-555-0202",
        passwordHash: hashedPassword,
        role: "customer",
        status: "active",
      },
    });

    const customer3 = await prisma.user.create({
      data: {
        fullName: "James Taylor",
        email: "james@example.com",
        phone: "+1-555-0203",
        passwordHash: hashedPassword,
        role: "customer",
        status: "active",
      },
    });

    const customer4 = await prisma.user.create({
      data: {
        fullName: "Maria Lopez",
        email: "maria@example.com",
        phone: "+1-555-0204",
        passwordHash: hashedPassword,
        role: "customer",
        status: "active",
      },
    });

    console.log("🏢 Creating categories...");

    // ===== CATEGORIES =====
    const category1 = await prisma.category.create({
      data: {
        name: "Cleaning Services",
        slug: "cleaning-services",
        description: "Professional cleaning services for homes and offices",
        icon: "Home",
        status: "active",
        displayOrder: 1,
      },
    });

    const category2 = await prisma.category.create({
      data: {
        name: "Plumbing",
        slug: "plumbing",
        description: "Pipe repairs, installations, and maintenance",
        icon: "ShowerHead",
        status: "active",
        displayOrder: 2,
      },
    });

    const category3 = await prisma.category.create({
      data: {
        name: "Electrical",
        slug: "electrical",
        description: "Wiring, repairs, and electrical installations",
        icon: "Zap",
        status: "active",
        displayOrder: 3,
      },
    });

    const category4 = await prisma.category.create({
      data: {
        name: "Painting Services",
        slug: "painting",
        description: "Interior and exterior painting services",
        icon: "Paintbrush",
        status: "active",
        displayOrder: 4,
      },
    });

    console.log("📋 Creating service types...");

    // ===== SERVICE TYPES =====
    const serviceType1 = await prisma.serviceType.create({
      data: {
        categoryId: category1.id,
        name: "Residential Cleaning",
        slug: "residential",
        description: "Regular home cleaning for bedrooms, living areas & more",
        icon: "Home",
        image:
          "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=600",
        status: "active",
        displayOrder: 1,
      },
    });

    const serviceType2 = await prisma.serviceType.create({
      data: {
        categoryId: category1.id,
        name: "Commercial Cleaning",
        slug: "commercial",
        description: "Professional cleaning for offices & business facilities",
        icon: "Building2",
        image:
          "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=600",
        status: "active",
        displayOrder: 2,
      },
    });

    const serviceType3 = await prisma.serviceType.create({
      data: {
        categoryId: category1.id,
        name: "Deep Cleaning",
        slug: "deep",
        description: "Thorough cleaning that reaches every corner",
        icon: "Sparkles",
        image:
          "https://images.unsplash.com/photo-1558317374-067fb5f30001?q=80&w=600",
        status: "active",
        displayOrder: 3,
      },
    });

    const serviceType4 = await prisma.serviceType.create({
      data: {
        categoryId: category1.id,
        name: "Move-In / Move-Out",
        slug: "move",
        description: "Perfect for relocations and getting deposits back",
        icon: "Truck",
        image:
          "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600",
        status: "active",
        displayOrder: 4,
      },
    });

    const serviceType5 = await prisma.serviceType.create({
      data: {
        categoryId: category1.id,
        name: "Carpet & Upholstery",
        slug: "carpet",
        description: "Deep clean carpets, sofas, and fabric furniture",
        icon: "Waves",
        image:
          "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=600",
        status: "active",
        displayOrder: 5,
      },
    });

    const serviceType6 = await prisma.serviceType.create({
      data: {
        categoryId: category1.id,
        name: "Kitchen Deep Clean",
        slug: "kitchen",
        description: "Appliances, grease removal & full sanitization",
        icon: "ChefHat",
        image:
          "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=600",
        status: "active",
        displayOrder: 6,
      },
    });

    const serviceType7 = await prisma.serviceType.create({
      data: {
        categoryId: category2.id,
        name: "Plumbing",
        slug: "plumbing",
        description: "Pipe repairs, installations, and maintenance",
        icon: "ShowerHead",
        image:
          "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?q=80&w=600",
        status: "active",
        displayOrder: 1,
      },
    });

    const serviceType8 = await prisma.serviceType.create({
      data: {
        categoryId: category3.id,
        name: "Electrical",
        slug: "electrical",
        description: "Wiring, repairs, and electrical installations",
        icon: "Zap",
        image:
          "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=600",
        status: "active",
        displayOrder: 1,
      },
    });

    console.log("🏪 Creating companies...");

    // ===== COMPANIES =====
    const company1 = await prisma.company.create({
      data: {
        name: "Clean Pro Services",
        description:
          "Professional cleaning services for residential and commercial properties. We pride ourselves on quality and reliability.",
        registrationNumber: "REG-2020-001",
        address: "123 Main Street",
        city: "New York",
        latitude: "40.7128",
        longitude: "-74.0060",
        phone: "+1-555-0101",
        email: "info@cleanpro.com",
        ownerId: owner1.id,
        verificationStatus: "verified",
        logoUrl: "https://via.placeholder.com/200?text=Clean+Pro",
        coverImageUrl:
          "https://via.placeholder.com/1200x400?text=Clean+Pro+Cover",
        establishedYear: 2015,
        cardHighlights: ["Fast Service", "24/7 Available", "Eco-Friendly"],
        detailHighlights: [
          "Licensed",
          "Insured",
          "5+ Years Experience",
          "Satisfaction Guaranteed",
        ],
      },
    });

    const company2 = await prisma.company.create({
      data: {
        name: "Plumb Pro Solutions",
        description:
          "Expert plumbing services including repairs, installations, and maintenance. Available for emergency calls.",
        registrationNumber: "REG-2018-002",
        address: "456 Oak Avenue",
        city: "Los Angeles",
        latitude: "34.0522",
        longitude: "-118.2437",
        phone: "+1-555-0102",
        email: "contact@plumbpro.com",
        ownerId: owner2.id,
        verificationStatus: "verified",
        logoUrl: "https://via.placeholder.com/200?text=Plumb+Pro",
        coverImageUrl:
          "https://via.placeholder.com/1200x400?text=Plumb+Pro+Cover",
        establishedYear: 2018,
        cardHighlights: [
          "Emergency Service",
          "Licensed Plumber",
          "Upfront Pricing",
        ],
        detailHighlights: [
          "24/7 Emergency",
          "No Hidden Fees",
          "30 Day Warranty",
          "Professional Team",
        ],
      },
    });

    const company3 = await prisma.company.create({
      data: {
        name: "Electric Tec",
        description:
          "Complete electrical solutions for homes and businesses. Certified electricians ready to help.",
        registrationNumber: "REG-2019-003",
        address: "789 Pine Road",
        city: "Chicago",
        latitude: "41.8781",
        longitude: "-87.6298",
        phone: "+1-555-0103",
        email: "service@electrictec.com",
        ownerId: owner3.id,
        verificationStatus: "pending",
        logoUrl: "https://via.placeholder.com/200?text=Electric+Tec",
        coverImageUrl:
          "https://via.placeholder.com/1200x400?text=Electric+Tec+Cover",
        establishedYear: 2019,
        cardHighlights: [
          "Certified Electricians",
          "Modern Equipment",
          "Fast Response",
        ],
        detailHighlights: [
          "Licensed",
          "Insured",
          "Energy Efficient",
          "Free Consultation",
        ],
      },
    });

    console.log("👔 Creating company staff...");

    // ===== COMPANY STAFF =====
    await prisma.companyStaff.create({
      data: {
        companyId: company1.id,
        userId: staff1.id,
        role: "supervisor",
        status: "active",
      },
    });

    await prisma.companyStaff.create({
      data: {
        companyId: company1.id,
        userId: staff2.id,
        role: "cleaner",
        status: "active",
      },
    });

    await prisma.companyStaff.create({
      data: {
        companyId: company2.id,
        userId: staff3.id,
        role: "supervisor",
        status: "active",
      },
    });

    console.log("🛠️  Creating services...");

    // ===== SERVICES =====
    const service1 = await prisma.service.create({
      data: {
        companyId: company1.id,
        serviceTypeId: serviceType1.id,
        name: "Standard House Cleaning",
        image: "https://via.placeholder.com/300x200?text=Standard+House",
        description:
          "2-3 hour complete house cleaning including vacuuming, mopping, dusting, and bathrooms",
        basePrice: "99.99",
        features: [
          "Vacuum",
          "Mop",
          "Dust",
          "Bathrooms",
          "Kitchen",
          "Living Areas",
        ],
        durationMin: 120,
        durationMax: 180,
      },
    });

    const service2 = await prisma.service.create({
      data: {
        companyId: company1.id,
        serviceTypeId: serviceType1.id,
        name: "Premium House Cleaning",
        image: "https://via.placeholder.com/300x200?text=Premium+House",
        description:
          "4-5 hour premium cleaning with all inclusions plus windows and carpets",
        basePrice: "199.99",
        features: [
          "All Standard Features",
          "Window Cleaning",
          "Carpet Cleaning",
          "Air Filter Change",
          "Baseboards",
          "Ceiling Fans",
        ],
        durationMin: 240,
        durationMax: 300,
      },
    });

    const service3 = await prisma.service.create({
      data: {
        companyId: company1.id,
        serviceTypeId: serviceType3.id,
        name: "Deep Clean Special",
        image: "https://via.placeholder.com/300x200?text=Deep+Clean",
        description: "6+ hour intensive deep cleaning of entire property",
        basePrice: "349.99",
        features: [
          "All Premium Features",
          "Deep Scrubbing",
          "Grout Cleaning",
          "Cabinet Insides",
          "Appliance Deep Clean",
        ],
        durationMin: 360,
        durationMax: 480,
      },
    });

    const service4 = await prisma.service.create({
      data: {
        companyId: company1.id,
        serviceTypeId: serviceType2.id,
        name: "Office Cleaning Package",
        image: "https://via.placeholder.com/300x200?text=Office+Cleaning",
        description:
          "Professional office cleaning for small to medium sized offices",
        basePrice: "149.99",
        features: [
          "Desk Cleaning",
          "Floor Cleaning",
          "Trash Removal",
          "Bathroom Sanitizing",
          "Common Areas",
        ],
        durationMin: 120,
        durationMax: 180,
      },
    });

    const service5 = await prisma.service.create({
      data: {
        companyId: company2.id,
        serviceTypeId: serviceType4.id,
        name: "Emergency Pipe Repair",
        image: "https://via.placeholder.com/300x200?text=Pipe+Repair",
        description: "Emergency pipe repair service available 24/7",
        basePrice: "199.99",
        features: [
          "Quick Response",
          "Professional Diagnosis",
          "Quality Repair",
          "Follow-up Support",
        ],
        durationMin: 60,
        durationMax: 120,
      },
    });

    const service6 = await prisma.service.create({
      data: {
        companyId: company2.id,
        serviceTypeId: serviceType5.id,
        name: "Bathroom Installation",
        image: "https://via.placeholder.com/300x200?text=Bathroom",
        description:
          "Complete bathroom plumbing installation including fixtures",
        basePrice: "449.99",
        features: [
          "Design Consultation",
          "Fixture Installation",
          "Testing",
          "Cleanup",
          "1-Year Warranty",
        ],
        durationMin: 480,
        durationMax: 600,
      },
    });

    const service7 = await prisma.service.create({
      data: {
        companyId: company3.id,
        serviceTypeId: serviceType6.id,
        name: "Home Wiring Service",
        image: "https://via.placeholder.com/300x200?text=Wiring",
        description:
          "Complete home electrical wiring installation and safety inspection",
        basePrice: "599.99",
        features: [
          "Safety Inspection",
          "Code Compliant",
          "Modern Wiring",
          "Circuit Testing",
          "Documentation",
        ],
        durationMin: 480,
        durationMax: 720,
      },
    });

    console.log("📅 Creating bookings...");

    // ===== BOOKINGS =====
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const booking1 = await prisma.booking.create({
      data: {
        customerId: customer1.id,
        serviceId: service1.id,
        companyId: company1.id,
        bookingDate: new Date("2026-02-15"),
        startTime: new Date("2026-02-15T10:00:00"),
        endTime: new Date("2026-02-15T12:00:00"),
        status: "confirmed",
        totalPrice: "99.99",
        platformFee: "9.99",
        companyEarnings: "90.00",
        serviceAddress: "321 Customer Lane, New York, NY",
        latitude: "40.7128",
        longitude: "-74.0060",
      },
    });

    const booking2 = await prisma.booking.create({
      data: {
        customerId: customer2.id,
        serviceId: service2.id,
        companyId: company1.id,
        bookingDate: new Date("2026-02-20"),
        startTime: new Date("2026-02-20T14:00:00"),
        endTime: new Date("2026-02-20T18:00:00"),
        status: "pending",
        totalPrice: "199.99",
        platformFee: "19.99",
        companyEarnings: "180.00",
        serviceAddress: "654 Customer Street, New York, NY",
        latitude: "40.7589",
        longitude: "-73.9851",
      },
    });

    const booking3 = await prisma.booking.create({
      data: {
        customerId: customer3.id,
        serviceId: service4.id,
        companyId: company1.id,
        bookingDate: new Date("2026-02-10"),
        startTime: new Date("2026-02-10T09:00:00"),
        endTime: new Date("2026-02-10T11:00:00"),
        status: "completed",
        totalPrice: "149.99",
        platformFee: "14.99",
        companyEarnings: "135.00",
        serviceAddress: "100 Business Plaza, New York, NY",
        latitude: "40.7127",
        longitude: "-74.0059",
      },
    });

    const booking4 = await prisma.booking.create({
      data: {
        customerId: customer4.id,
        serviceId: service5.id,
        companyId: company2.id,
        bookingDate: new Date("2026-02-08"),
        startTime: new Date("2026-02-08T16:30:00"),
        endTime: new Date("2026-02-08T18:00:00"),
        status: "in_progress",
        totalPrice: "199.99",
        platformFee: "19.99",
        companyEarnings: "180.00",
        serviceAddress: "789 Residential Road, Los Angeles, CA",
        latitude: "34.0522",
        longitude: "-118.2437",
      },
    });

    const booking5 = await prisma.booking.create({
      data: {
        customerId: customer1.id,
        serviceId: service5.id,
        companyId: company2.id,
        bookingDate: new Date("2026-01-25"),
        startTime: new Date("2026-01-25T11:00:00"),
        endTime: new Date("2026-01-25T12:00:00"),
        status: "completed",
        totalPrice: "199.99",
        platformFee: "19.99",
        companyEarnings: "180.00",
        serviceAddress: "321 Customer Lane, New York, NY",
        latitude: "40.7128",
        longitude: "-74.0060",
      },
    });

    console.log("💳 Creating payments...");

    // ===== PAYMENTS =====
    const payment1 = await prisma.payment.create({
      data: {
        bookingId: booking1.id,
        userId: customer1.id,
        amount: "99.99",
        method: "card",
        status: "paid",
        transactionRef: "TXN-2026-001",
        currency: "USD",
      },
    });

    const payment2 = await prisma.payment.create({
      data: {
        bookingId: booking2.id,
        userId: customer2.id,
        amount: "199.99",
        method: "card",
        status: "pending",
        transactionRef: "TXN-2026-002",
        currency: "USD",
      },
    });

    const payment3 = await prisma.payment.create({
      data: {
        bookingId: booking3.id,
        userId: customer3.id,
        amount: "149.99",
        method: "cash",
        status: "paid",
        transactionRef: "TXN-2026-003",
        currency: "USD",
      },
    });

    const payment4 = await prisma.payment.create({
      data: {
        bookingId: booking4.id,
        userId: customer4.id,
        amount: "199.99",
        method: "card",
        status: "paid",
        transactionRef: "TXN-2026-004",
        currency: "USD",
      },
    });

    const payment5 = await prisma.payment.create({
      data: {
        bookingId: booking5.id,
        userId: customer1.id,
        amount: "199.99",
        method: "cash",
        status: "paid",
        transactionRef: "TXN-2026-005",
        currency: "USD",
      },
    });

    console.log("⭐ Creating reviews...");

    // ===== REVIEWS =====
    await prisma.review.create({
      data: {
        bookingId: booking3.id,
        customerId: customer3.id,
        rating: 5,
        comment:
          "Excellent service! The team was professional and thorough. Highly recommended!",
      },
    });

    await prisma.review.create({
      data: {
        bookingId: booking5.id,
        customerId: customer1.id,
        rating: 4,
        comment:
          "Great work on fixing the pipe. Very professional plumbers. Would use again.",
      },
    });

    await prisma.review.create({
      data: {
        bookingId: booking1.id,
        customerId: customer1.id,
        rating: 5,
        comment:
          "Amazing cleaning service! My house looks brand new. Will definitely book again.",
      },
    });

    console.log("✅ Seed completed successfully!");
    console.log("\n📊 Data Summary:");
    console.log(
      "  Users: 1 Admin, 3 Company Owners, 3 Staff, 4 Customers (11 total)",
    );
    console.log("  Categories: 4");
    console.log("  Service Types: 7");
    console.log("  Companies: 3");
    console.log("  Services: 7");
    console.log("  Bookings: 5");
    console.log("  Payments: 5");
    console.log("  Reviews: 3");
    console.log("\n🔐 Default Login Credentials:");
    console.log("  Email: admin@servicefinder.com");
    console.log("  Password: Password123!");
    console.log("\n💼 Company Login Credentials:");
    console.log("  Email: john@cleanpro.com (Clean Pro Services)");
    console.log("  Email: sarah@plumbpro.com (Plumb Pro Solutions)");
    console.log("  Email: mike@electrictec.com (Electric Tec)");
    console.log("  Password: Password123! (for all)");
    console.log("\n👤 Customer Login Credentials:");
    console.log("  Email: emma@example.com");
    console.log("  Email: lisa@example.com");
    console.log("  Email: james@example.com");
    console.log("  Email: maria@example.com");
    console.log("  Password: Password123! (for all)");
  } catch (error) {
    console.error("❌ Error during seed:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
