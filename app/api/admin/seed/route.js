import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Category from "@/models/Category";
import Order from "@/models/Order";
import Quote from "@/models/Quote";
import StaffApproval from "@/models/StaffApproval";
import SupportTicket from "@/models/SupportTicket";
import BrandSettings from "@/models/BrandSettings";
import Plan from "@/models/Plan";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    await dbConnect();

    // 0. Clean up existing mock data
    await User.deleteMany({});
    await Category.deleteMany({});
    await Order.deleteMany({});
    await Quote.deleteMany({});
    await StaffApproval.deleteMany({});
    await SupportTicket.deleteMany({});
    await BrandSettings.deleteMany({});
    await Plan.deleteMany({});

    // 0.5. Seed Default Plans
    const defaultPlans = [
      // Single Bed Plans
      {
        bedType: "single",
        name: "Starter",
        duration: "1 Month",
        price: 300,
        originalPrice: null,
        discount: null,
        features: [
          "4 Single Bedsheets",
          "4 Pillow Covers",
          "Free delivery & pickup",
          "Flexible scheduling options",
          "Customer support access",
          "24/7 delivery tracking"
        ],
        cta: "Choose Starter",
        popular: false,
        badge: null
      },
      {
        bedType: "single",
        name: "Growth",
        duration: "3 Months",
        price: 855,
        originalPrice: 900,
        discount: "5% off",
        features: [
          "4 Single Bedsheets",
          "4 Pillow Covers",
          "Free delivery & pickup",
          "Priority support desk",
          "Flexible scheduling rights",
          "Quality clean guarantee",
          "Express swap processing"
        ],
        cta: "Choose Growth",
        popular: false,
        badge: null
      },
      {
        bedType: "single",
        name: "Professional",
        duration: "6 Months",
        price: 1620,
        originalPrice: 1800,
        discount: "10% off",
        features: [
          "4 Single Bedsheets",
          "4 Pillow Covers",
          "Free delivery & pickup",
          "Premium support hotline",
          "Express delivery priority",
          "Complimentary damage cover",
          "Free emergency swaps"
        ],
        cta: "Choose Professional",
        popular: true,
        badge: "Best Value"
      },
      {
        bedType: "single",
        name: "Enterprise",
        duration: "12 Months",
        price: 2880,
        originalPrice: 3600,
        discount: "20% off",
        features: [
          "4 Single Bedsheets",
          "4 Pillow Covers",
          "Free delivery & pickup",
          "Dedicated account manager",
          "Same-day delivery service",
          "Free sheet replacements",
          "VIP loyalty benefits"
        ],
        cta: "Choose Enterprise",
        popular: false,
        badge: null
      },
      // Double Bed Plans
      {
        bedType: "double",
        name: "Starter",
        duration: "1 Month",
        price: 800,
        originalPrice: null,
        discount: null,
        features: [
          "4 Double Bedsheets",
          "8 Pillow Covers",
          "Free delivery & pickup",
          "Flexible scheduling options",
          "Customer support access",
          "24/7 delivery tracking"
        ],
        cta: "Choose Starter",
        popular: false,
        badge: null
      },
      {
        bedType: "double",
        name: "Growth",
        duration: "3 Months",
        price: 2280,
        originalPrice: 2400,
        discount: "5% off",
        features: [
          "4 Double Bedsheets",
          "8 Pillow Covers",
          "Free delivery & pickup",
          "Priority support desk",
          "Flexible scheduling rights",
          "Quality clean guarantee",
          "Express swap processing"
        ],
        cta: "Choose Growth",
        popular: false,
        badge: null
      },
      {
        bedType: "double",
        name: "Professional",
        duration: "6 Months",
        price: 4320,
        originalPrice: 4800,
        discount: "10% off",
        features: [
          "4 Double Bedsheets",
          "8 Pillow Covers",
          "Free delivery & pickup",
          "Premium support hotline",
          "Express delivery priority",
          "Complimentary damage cover",
          "Free emergency swaps"
        ],
        cta: "Choose Professional",
        popular: true,
        badge: "Best Value"
      },
      {
        bedType: "double",
        name: "Enterprise",
        duration: "12 Months",
        price: 7680,
        originalPrice: 9600,
        discount: "20% off",
        features: [
          "4 Double Bedsheets",
          "8 Pillow Covers",
          "Free delivery & pickup",
          "Dedicated account manager",
          "Same-day delivery service",
          "Free sheet replacements",
          "VIP loyalty benefits"
        ],
        cta: "Choose Enterprise",
        popular: false,
        badge: null
      }
    ];
    await Plan.insertMany(defaultPlans);

    // 1. Seed Admin & Sample Users
    const adminEmail = "admin@closetrush.com";
    const hashedPassword = await bcrypt.hash("adminpassword", 10);
    const admin = await User.create({
      name: "Admin User",
      email: adminEmail,
      mobile: "9999999999",
      password: hashedPassword,
      address: "HQ, ClosetRush Delhi NCR",
      accountType: "Individual User",
      role: "admin",
      status: "ACTIVE",
    });

    const sampleUsers = [
      { name: "Prasad Shaswat", email: "prasadshaswat9265@gmail.com", mobile: "9265318481", accountType: "Individual User", role: "user", status: "ACTIVE", createdAt: new Date("2026-06-08") },
      { name: "Ndumiso Sibanda", email: "ndumisosib16@gmail.com", mobile: "9000000001", accountType: "Individual User", role: "user", status: "ACTIVE", createdAt: new Date("2026-06-05") },
      { name: "Fidel Mekondjo", email: "mekondjofidel69@gmail.com", mobile: "7988167594", accountType: "Individual User", role: "user", status: "ACTIVE", createdAt: new Date("2026-06-05") },
      { name: "Abdullahi Khalil Gwarzo", email: "khalilgwarzoabdullahi@gmail.com", mobile: "9996452829", accountType: "Individual User", role: "user", status: "ACTIVE", createdAt: new Date("2026-06-05") },
      { name: "abdullahi saeed", email: "abdulsaeeed7@gmail.com", mobile: "9289139885", accountType: "Individual User", role: "user", status: "ACTIVE", createdAt: new Date("2026-06-05") },
      { name: "Sahab", email: "sahab20112000@gmail.com", mobile: "9000000002", accountType: "Individual User", role: "user", status: "ACTIVE", createdAt: new Date("2026-06-04") },
      { name: "Roshan kumar yadav", email: "roshankumar55yadav@gmail.com", mobile: "7783807398", accountType: "Individual User", role: "user", status: "ACTIVE", createdAt: new Date("2026-06-04") },
      { name: "kapil maurya", email: "kapilmaurya79833@gmail.com", mobile: "7983373456", accountType: "Individual User", role: "user", status: "ACTIVE", createdAt: new Date("2026-06-02") },
      { name: "Nibha Singh", email: "nsinghmzp98@gmail.com", mobile: "6392944580", accountType: "Individual User", role: "user", status: "ACTIVE", createdAt: new Date("2026-05-26") },
      { name: "Trend Leap", email: "trendleap.info@gmail.com", mobile: "9305688584", accountType: "Commercial Partner", role: "user", status: "ACTIVE", createdAt: new Date("2026-05-25") },
    ];

    const dummyPassword = await bcrypt.hash("userpassword", 10);
    const usersToInsert = sampleUsers.map(u => ({
      ...u,
      password: dummyPassword,
    }));
    await User.insertMany(usersToInsert);

    // 2. Seed Categories
    const sampleCategories = [
      { name: "Pillow Covers", description: "Soft hygienic pillow covers", pricePerItem: 40, status: "ACTIVE", totalStock: 300, availableStock: 220, rentedStock: 60, laundryStock: 20 },
      { name: "Quilt", description: "Seasonal Finds", pricePerItem: 500, status: "ACTIVE", totalStock: 100, availableStock: 70, rentedStock: 20, laundryStock: 10 },
      { name: "Curtains", description: "Get Set and Forget", pricePerItem: 100, status: "ACTIVE", totalStock: 150, availableStock: 120, rentedStock: 20, laundryStock: 10 },
      { name: "Double bed Bedsheet", description: "Elegant and Comfortable Double Bed Bedsheet", pricePerItem: 500, status: "ACTIVE", totalStock: 200, availableStock: 140, rentedStock: 40, laundryStock: 20 },
      { name: "Single bed Bedsheet", description: "Premium and Comfortable Single Bed Bedsheet", pricePerItem: 300, status: "ACTIVE", totalStock: 250, availableStock: 180, rentedStock: 50, laundryStock: 20 },
    ];
    await Category.insertMany(sampleCategories);

    // 3. Seed Orders
    const sampleOrders = [
      { bundleOrderId: "BSINBEDBUNX00007", userId: "B5162341", userName: "Trend Leap", phone: "9305688584", email: "trendleap.info@gmail.com", bundleName: "Single Bed Bundle", duration: "—", finalPrice: 1, status: "CANCELLED", startDate: new Date("2026-05-25"), endDate: new Date("2026-06-25"), deliveryAddress: "Gurugram Sohna road, Haryana 122103" },
      { bundleOrderId: "BSINBEDBUNX00006", userId: "DE1923FD", userName: "Sujeet Saroj", phone: "9918304056", email: "sujeetsaroj2025@gmail.com", bundleName: "Single Bed Bundle", duration: "—", finalPrice: 1, status: "ACTIVE", startDate: new Date("2026-05-23"), endDate: new Date("2026-06-23"), deliveryAddress: "Badshahpur" },
      { bundleOrderId: "BSINBEDBUNX00005", userId: "2AB5524E", userName: "Deepak joshi", phone: "7340502080", email: "deepakjoshisrdr@gmail.com", bundleName: "Single Bed Bundle", duration: "—", finalPrice: 1, status: "ACTIVE", startDate: new Date("2026-05-23"), endDate: new Date("2026-06-23"), deliveryAddress: "D41, Siddharth Nagar Road" },
      { bundleOrderId: "BSINBEDBUNX00004", userId: "2AB549E2", userName: "Jj Jv", phone: "7474839355", email: "jvjj51600@gmail.com", bundleName: "Single Bed Bundle", duration: "—", finalPrice: 1, status: "CANCELLED", startDate: new Date("2026-05-22"), endDate: new Date("2026-06-22"), deliveryAddress: "Hdjakansdnndksl" },
      { bundleOrderId: "BSINBEDBUNX00003", userId: "—", userName: "—", phone: "—", email: "—", bundleName: "Single Bed Bundle", duration: "—", finalPrice: 1, status: "ACTIVE", startDate: new Date("2026-05-22"), endDate: new Date("2026-06-22"), deliveryAddress: "—" },
      { bundleOrderId: "BSINBEDBUNX00002", userId: "BE9AEB32", userName: "Daksh Verma", phone: "1892979832", email: "verma@gmail.com", bundleName: "Single Bed Bundle", duration: "—", finalPrice: 1, status: "CANCELLED", startDate: new Date("2026-05-22"), endDate: new Date("2026-06-22"), deliveryAddress: "Old city Loharu ward no.2" },
      { bundleOrderId: "BSINBEDBUNX00001", userId: "17AA9811", userName: "Ruchi Pathak", phone: "7524888707", email: "ruchipathak418@gmail.com", bundleName: "Single Bed Bundle", duration: "—", finalPrice: 1, status: "ACTIVE", startDate: new Date("2026-05-20"), endDate: new Date("2026-06-20"), deliveryAddress: "Q-301, OUR HOMES 3, THE COURTYARD BY TRISARA, SOHNA ROAD, GURUGRAM, HARYANA 122103" },
      { bundleOrderId: "CDOUBEDBUN-BR-SL-PL-X00001", userId: "BE9AEB32", userName: "Daksh Verma", phone: "1892979832", email: "verma@gmail.com", bundleName: "Double Bed Bundle", duration: "—", finalPrice: 1, status: "CANCELLED", startDate: new Date("2026-05-14"), endDate: new Date("2026-06-14"), deliveryAddress: "Old city Loharu ward no.2" },
      { bundleOrderId: "BDOUBEDBUNX00010", userId: "BE9AEB32", userName: "Daksh Verma", phone: "1892979832", email: "verma@gmail.com", bundleName: "Double Bed Bundle", duration: "—", finalPrice: 1, status: "CANCELLED", startDate: new Date("2026-05-14"), endDate: new Date("2026-06-14"), deliveryAddress: "Old city Loharu ward no.2" },
      { bundleOrderId: "BDOUBEDBUNX00009", userId: "DB712B6D", userName: "Daksh Verma", phone: "4646466464", email: "dakshverma633@gmail.com", bundleName: "Double Bed Bundle", duration: "—", finalPrice: 1, status: "ACTIVE", startDate: new Date("2026-05-12"), endDate: new Date("2026-06-12"), deliveryAddress: "dasdsfdafds" },
      { bundleOrderId: "BDOUBEDBUNX00008", userId: "BE9AEB32", userName: "Daksh Verma", phone: "1892979832", email: "verma@gmail.com", bundleName: "Double Bed Bundle", duration: "—", finalPrice: 1, status: "CANCELLED", startDate: new Date("2026-05-12"), endDate: new Date("2026-06-12"), deliveryAddress: "Old city Loharu ward no.2" },
      { bundleOrderId: "BDOUBEDBUNX00007", userId: "DB712B6D", userName: "Daksh Verma", phone: "4646466464", email: "dakshverma633@gmail.com", bundleName: "Double Bed Bundle", duration: "—", finalPrice: 1, status: "ACTIVE", startDate: new Date("2026-05-11"), endDate: new Date("2026-06-11"), deliveryAddress: "dasdsfdafds" },
    ];
    await Order.insertMany(sampleOrders);

    // 4. Seed Connection & Quotation Requests
    const sampleQuotes = [
      { type: "connection", businessName: "bzxv", contactPerson: "chjsbfnm", email: "dasjbhjb@gmail.com", phone: "1234567890", businessType: "PG", message: "—", status: "PENDING", receivedAt: new Date("2026-04-20") },
      { type: "connection", businessName: "eternal", contactPerson: "Jayant", email: "jayantydv30@gmail.com", phone: "8571835332", businessType: "PG", message: "—", status: "CONTACTED", receivedAt: new Date("2026-04-17") },
      { type: "connection", businessName: "nn", contactPerson: "mn", email: "verma@gmail.com", phone: "1234567890", businessType: "PG", message: "—", status: "ACCEPTED", receivedAt: new Date("2026-04-17") },
      { type: "quotation", businessName: "gasfdzh", contactPerson: "safgd", email: "aszfes@gmail.com", phone: "9876543456", businessType: "BUILDING", propertiesCount: 6, unitsCount: 60, bundleSelections: "Quilt (1x)", estimatedTotal: 3000, status: "QUOTE SENT", receivedAt: new Date("2026-04-16") },
      { type: "quotation", businessName: "dg", contactPerson: "Daksh Verma", email: "daksh.verma.22cse@bmu.edu.in", phone: "0906969737", businessType: "HOMESTAY", propertiesCount: 5, unitsCount: 30, bundleSelections: "Quilt (2x) +3 more", estimatedTotal: 194500, status: "PENDING", receivedAt: new Date("2026-04-15") },
      { type: "quotation", businessName: "Eternal Resu=idency", contactPerson: "Jayant", email: "jayantydv30@gmail.com", phone: "8571835332", businessType: "PG", propertiesCount: 4, unitsCount: 24, bundleSelections: "Quilt (1x) +2 more", estimatedTotal: 5200, status: "PENDING", receivedAt: new Date("2026-04-15") },
      { type: "quotation", businessName: "pg1", contactPerson: "Daksh Verma", email: "daksh.verma.22cse@bmu.edu.in", phone: "0930669737", businessType: "PG", propertiesCount: 6, unitsCount: 90, bundleSelections: "Quilt (5x) +3 more", estimatedTotal: 6500, status: "PENDING", receivedAt: new Date("2026-04-14") },
      { type: "quotation", businessName: "fdgh", contactPerson: "dfxdhjb", email: "dfcgv@gmail.com", phone: "1234567890", businessType: "PG", propertiesCount: 1, unitsCount: 1, bundleSelections: "No bundles", estimatedTotal: 0, status: "PENDING", receivedAt: new Date("2026-04-12") },
      { type: "quotation", businessName: "fdf", contactPerson: "fgfd", email: "verma@gmail.com", phone: "0189297987", businessType: "PG", propertiesCount: 1, unitsCount: 1, bundleSelections: "No bundles", estimatedTotal: 0, status: "PENDING", receivedAt: new Date("2026-04-12") },
      { type: "quotation", businessName: "dg", contactPerson: "jkfdn", email: "verma@gmail.com", phone: "0189299832", businessType: "PG", propertiesCount: 1, unitsCount: 1, bundleSelections: "No bundles", estimatedTotal: 0, status: "NEGOTIATING", receivedAt: new Date("2026-04-11") },
      { type: "quotation", businessName: "pg1", contactPerson: "Daksh Verma", email: "daksh.verma.22@bmu.edu.in", phone: "0930696737", businessType: "PG", propertiesCount: 1, unitsCount: 1, bundleSelections: "No bundles", estimatedTotal: 0, status: "ACCEPTED", receivedAt: new Date("2026-04-10") },
    ];
    await Quote.insertMany(sampleQuotes);

    // 5. Seed Staff Approvals
    const sampleStaff = [
      { name: "ware", email: "warehouse@closetrush.com", mobile: "1234565432", role: "WH", status: "APPROVED", registeredAt: new Date("2026-04-29") },
      { name: "logi_partner", email: "logistics@closetrush.com", mobile: "9876543210", role: "LP", status: "APPROVED", registeredAt: new Date("2026-04-28") },
      { name: "pending_manager", email: "p_mgr@closetrush.com", mobile: "5556667777", role: "WH", status: "PENDING", registeredAt: new Date("2026-06-01") },
    ];
    await StaffApproval.insertMany(sampleStaff);

    // Auto-create user login accounts for approved staff in seeder (only for LP to test active state, WH remains provision-pending)
    const staffPasswordHash = await bcrypt.hash("staffpassword", 10);
    await User.create({
      name: "logi_partner",
      email: "logistics@closetrush.com",
      mobile: "9876543210",
      password: staffPasswordHash,
      role: "logistics",
      status: "ACTIVE",
      accountType: "Individual User",
      address: "Logistics Hub, Delhi NCR"
    });

    // 6. Seed Support Tickets
    const sampleTickets = [
      { ticketId: "TKT001", subject: "Bedsheet torn during delivery", userName: "Prasad Shaswat", userEmail: "prasadshaswat9265@gmail.com", priority: "HIGH", status: "OPEN" },
      { ticketId: "TKT002", subject: "Inquiry about business rates", userName: "Trend Leap", userEmail: "trendleap.info@gmail.com", priority: "MEDIUM", status: "IN_PROGRESS" },
    ];
    await SupportTicket.insertMany(sampleTickets);

    // 7. Seed Brand Settings
    await BrandSettings.create({
      brandName: "ClosetRush",
      installBannerText: "Add to home screen for a better experience",
      installBannerActive: true,
      primaryColor: "#0F172A",
      accentColor: "#245c77",
      contactEmail: "support@closetrush.com",
    });

    return NextResponse.json({
      success: true,
      message: "ClosetRush Admin Database seeded successfully",
      admin: {
        email: adminEmail,
        password: "adminpassword",
      },
    });
  } catch (error) {
    console.error("Database Seeding Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
