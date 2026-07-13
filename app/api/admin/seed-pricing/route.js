import { NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/lib/db";
import Plan from "@/models/Plan";
import DurationDiscount from "@/models/DurationDiscount";
import { verifyAdmin } from "@/lib/adminAuth";

export async function GET(request) {
  try {
    await dbConnect();

    // Clear mongoose cache for hot-reload
    delete mongoose.models.Plan;
    delete mongoose.models.DurationDiscount;

    // 1. Seed Plans
    await Plan.deleteMany({});
    const plans = [
      { tier: "Normal", bedType: "single", monthlyRate: 300, depositAmount: 500 },
      { tier: "Normal", bedType: "double", monthlyRate: 800, depositAmount: 800 },
      { tier: "Premium", bedType: "single", monthlyRate: 750, depositAmount: 0 },
      { tier: "Premium", bedType: "double", monthlyRate: 950, depositAmount: 0 },
    ];
    await Plan.insertMany(plans);

    // 2. Seed Duration Discounts
    await DurationDiscount.deleteMany({});
    const discounts = [
      { durationMonths: 1, discountPercent: 0 },
      { durationMonths: 3, discountPercent: 5 },
      { durationMonths: 6, discountPercent: 10 },
      { durationMonths: 9, discountPercent: 10 },
      { durationMonths: 12, discountPercent: 20 },
    ];
    await DurationDiscount.insertMany(discounts);

    return NextResponse.json({ success: true, message: "Pricing and discounts seeded successfully." });
  } catch (error) {
    console.error("Seed Pricing Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
