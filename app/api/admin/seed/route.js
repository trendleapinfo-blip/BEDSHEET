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
import Coupon from "@/models/Coupon";
import Bundle from "@/models/Bundle";
import bcrypt from "bcryptjs";
import { verifyAdmin } from "@/lib/adminAuth";

export async function POST(request) {
  try {
    // Allow access via admin JWT OR via SEED_SECRET header (bootstrap use)
    const admin = await verifyAdmin();
    const seedSecret = request.headers.get("x-seed-secret");
    const validSecret = "closerush_seed_bootstrap_2026";

    if (!admin && seedSecret !== validSecret) {
      return NextResponse.json({ error: "Forbidden. Admin auth or valid seed secret required." }, { status: 403 });
    }

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
    await Coupon.deleteMany({});
    await Bundle.deleteMany({});



    // 1. Seed Admin & Sample Users
    const adminEmail = "admin@closetrush.com";
    const hashedPassword = await bcrypt.hash("adminpassword", 10);
    const seededAdmin = await User.create({
      name: "Admin User",
      email: adminEmail,
      mobile: "9999999999",
      password: hashedPassword,
      address: "HQ, ClosetRush Delhi NCR",
      accountType: "Individual User",
      role: "admin",
      status: "ACTIVE",
    });

    // 2. Seed dynamic default categories
    await Category.create([
      { name: "Bedsheet + Pillow (Single)", description: "Premium single bed sheets and pillow covers set", pricePerItem: 300, totalStock: 100, availableStock: 100 },
      { name: "Bedsheet + Pillow (Double)", description: "Premium double bed sheets and pillow covers set", pricePerItem: 800, totalStock: 100, availableStock: 100 },
      { name: "Curtains", description: "Sanitized window and door curtains", pricePerItem: 400, totalStock: 100, availableStock: 100 },
      { name: "Quilts", description: "High-loft sanitized warm quilts", pricePerItem: 500, totalStock: 100, availableStock: 100 },
      { name: "Blankets", description: "Thermodynamic hot-washed warm blankets", pricePerItem: 450, totalStock: 100, availableStock: 100 },
    ]);

    // 3. Seed B2C Plans
    await Plan.create([
      { bedType: "Bedsheet + Pillow (Single)", size: "6x3 ft", name: "Single Bed Plan", duration: "1 Month", price: 300, securityDeposit: 500, features: ["1 Clean Bedsheet", "1 Pillow Cover", "Free Doorstep Delivery"], cta: "Choose Plan" },
      { bedType: "Bedsheet + Pillow (Single)", size: "6x3 ft", name: "Single Bed Plan", duration: "3 Months", price: 855, securityDeposit: 500, discount: "5% off", features: ["3 Swaps (1 per month)", "1 Pillow Cover", "Free Doorstep swaps"], cta: "Choose Plan" },
      { bedType: "Bedsheet + Pillow (Single)", size: "6x3 ft", name: "Single Bed Plan", duration: "12 Months", price: 3240, securityDeposit: 500, discount: "10% off", popular: true, badge: "Best Value", features: ["12 Swaps (1 per month)", "1 Pillow Cover", "Premium Sateen Cotton", "Priority logistics"], cta: "Choose Plan" },
      
      { bedType: "Bedsheet + Pillow (Double)", size: "6x5 ft", name: "Double Bed Plan", duration: "1 Month", price: 800, securityDeposit: 800, features: ["2 Clean Bedsheets", "2 Pillow Covers", "Free Doorstep Delivery"], cta: "Choose Plan" },
      { bedType: "Bedsheet + Pillow (Double)", size: "6x5 ft", name: "Double Bed Plan", duration: "3 Months", price: 2280, securityDeposit: 800, discount: "5% off", features: ["3 Swaps (1 per month)", "2 Pillow Covers", "Free Doorstep Swaps"], cta: "Choose Plan" },
      { bedType: "Bedsheet + Pillow (Double)", size: "6x5 ft", name: "Double Bed Plan", duration: "12 Months", price: 8640, securityDeposit: 800, discount: "10% off", popular: true, badge: "Best Value", features: ["12 Swaps (1 per month)", "2 Pillow Covers", "Premium Sateen Cotton", "Priority logistics"], cta: "Choose Plan" },

      { bedType: "Curtains", size: "Standard", name: "Linen Curtains Plan", duration: "1 Month", price: 400, securityDeposit: 600, features: ["2 Premium Curtains", "Sanitization wash", "Free Doorstep swaps"], cta: "Choose Plan" },
      { bedType: "Curtains", size: "Standard", name: "Linen Curtains Plan", duration: "3 Months", price: 1140, securityDeposit: 600, discount: "5% off", features: ["6 Swaps (2 per month)", "Thermal disinfection", "Free Doorstep swaps"], cta: "Choose Plan" },
      { bedType: "Curtains", size: "Standard", name: "Linen Curtains Plan", duration: "12 Months", price: 4320, securityDeposit: 600, discount: "10% off", popular: true, badge: "Popular", features: ["24 Swaps (2 per month)", "Dust barrier seal", "Priority logistics"], cta: "Choose Plan" },

      { bedType: "Quilts", size: "6x5 ft", name: "Warm Quilt Plan", duration: "1 Month", price: 600, securityDeposit: 1000, features: ["1 Hypoallergenic Quilt", "High-loft microfibers", "Free Doorstep swaps"], cta: "Choose Plan" },
      { bedType: "Quilts", size: "6x5 ft", name: "Warm Quilt Plan", duration: "3 Months", price: 1710, securityDeposit: 1000, discount: "5% off", features: ["3 Swaps (1 per month)", "Thermal sterilization", "Free Doorstep swaps"], cta: "Choose Plan" },
      { bedType: "Quilts", size: "6x5 ft", name: "Warm Quilt Plan", duration: "12 Months", price: 6480, securityDeposit: 1000, discount: "10% off", popular: true, badge: "Best Value", features: ["12 Swaps (1 per month)", "Airtight vacuum seal pack", "Priority logistics"], cta: "Choose Plan" },

      { bedType: "Blankets", size: "6x5 ft", name: "Premium Blanket Plan", duration: "1 Month", price: 500, securityDeposit: 1000, features: ["1 Thermoregulatory Blanket", "UV-C sanitized finish", "Free Doorstep swaps"], cta: "Choose Plan" },
      { bedType: "Blankets", size: "6x5 ft", name: "Premium Blanket Plan", duration: "3 Months", price: 1425, securityDeposit: 1000, discount: "5% off", features: ["3 Swaps (1 per month)", "Thermal sterilization", "Free Doorstep swaps"], cta: "Choose Plan" },
      { bedType: "Blankets", size: "6x5 ft", name: "Premium Blanket Plan", duration: "12 Months", price: 5400, securityDeposit: 1000, discount: "10% off", popular: true, badge: "Best Value", features: ["12 Swaps (1 per month)", "Airtight vacuum seal pack", "Priority logistics"], cta: "Choose Plan" },
    ]);

    // 4. Seed Promo Coupon
    await Coupon.create({
      code: "FRESHBED10",
      discountType: "percentage",
      discountValue: 10,
      minPurchase: 500,
      maxDiscount: 200,
      isActive: true,
    });

    // 5. Seed Mock Orders (PENDING WMS)
    await Order.create([
      {
        bundleOrderId: "ORD-83921",
        userId: seededAdmin._id.toString(),
        userName: "Prasad Shaswat",
        phone: "9999999999",
        email: "customer@closetrush.com",
        bundleName: "Bedsheet + Pillow (Double)",
        duration: "1 Month",
        finalPrice: 800,
        status: "PENDING",
        orderType: "RENT",
        deliveryAddress: "HQ, ClosetRush Delhi NCR, Delhi NCR - 394210 | Linen Gold",
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      },
      {
        bundleOrderId: "ORD-12940",
        userId: seededAdmin._id.toString(),
        userName: "Amit Kumar",
        phone: "9876543210",
        email: "amit@example.com",
        bundleName: "Bedsheet + Pillow (Single)",
        duration: "3 Months",
        finalPrice: 855,
        status: "PENDING",
        orderType: "RENT",
        deliveryAddress: "Flat 202, Sector 15, Gurugram - 122001 | Deep Teal",
        startDate: new Date(),
        endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
      }
    ]);

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



