import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Plan from "@/models/Plan";
import DurationDiscount from "@/models/DurationDiscount";

export async function GET() {
  try {
    await dbConnect();

    const plans = await Plan.find({});
    const discounts = await DurationDiscount.find({}).sort({ durationMonths: 1 });

    return NextResponse.json({
      success: true,
      plans,
      discounts
    });
  } catch (error) {
    console.error("Fetch Pricing Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
