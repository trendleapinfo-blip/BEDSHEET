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
import DurationDiscount from "@/models/DurationDiscount";
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
    await DurationDiscount.deleteMany({});



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
      { tier: "Normal", bedType: "single", monthlyRate: 300, depositAmount: 500 },
      { tier: "Normal", bedType: "double", monthlyRate: 800, depositAmount: 800 },
      { tier: "Premium", bedType: "single", monthlyRate: 750, depositAmount: 0 },
      { tier: "Premium", bedType: "double", monthlyRate: 950, depositAmount: 0 },
    ]);

    // Seed Duration Discounts
    await DurationDiscount.create([
      { durationMonths: 1, discountPercent: 0 },
      { durationMonths: 3, discountPercent: 5 },
      { durationMonths: 6, discountPercent: 10 },
      { durationMonths: 9, discountPercent: 10 },
      { durationMonths: 12, discountPercent: 20 },
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



