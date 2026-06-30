import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Coupon from "@/models/Coupon";

export async function POST(request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret");
    } catch (err) {
      return NextResponse.json({ error: "Invalid session token." }, { status: 401 });
    }

    const { couponCode, subtotal } = await request.json();

    if (!couponCode || subtotal === undefined) {
      return NextResponse.json({ error: "Coupon code and subtotal are required." }, { status: 400 });
    }

    await dbConnect();

    // Verify user and ensure B2C (Individual User) account type
    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    if (user.accountType !== "Individual User") {
      return NextResponse.json(
        { error: "Coupon offers are only available for B2C Individual accounts, not B2B Commercial accounts." },
        { status: 400 }
      );
    }

    const uppercaseCode = couponCode.trim().toUpperCase();
    const coupon = await Coupon.findOne({ code: uppercaseCode });

    if (!coupon) {
      return NextResponse.json({ error: "Invalid coupon code." }, { status: 404 });
    }

    if (!coupon.isActive) {
      return NextResponse.json({ error: "This coupon is no longer active." }, { status: 400 });
    }

    const now = new Date();

    if (coupon.startDate && now < new Date(coupon.startDate)) {
      return NextResponse.json({ error: "This coupon promotion has not started yet." }, { status: 400 });
    }

    if (coupon.endDate && now > new Date(coupon.endDate)) {
      return NextResponse.json({ error: "This coupon code has expired." }, { status: 400 });
    }

    if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
      return NextResponse.json({ error: "This coupon usage limit has been reached." }, { status: 400 });
    }

    if (Number(subtotal) < coupon.minPurchase) {
      return NextResponse.json(
        { error: `Minimum order value of ₹${coupon.minPurchase} required to apply this coupon.` },
        { status: 400 }
      );
    }

    // Calculate discount
    let discount = 0;
    if (coupon.discountType === "percentage") {
      discount = Math.round(Number(subtotal) * (coupon.discountValue / 100));
      if (coupon.maxDiscount !== null && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else if (coupon.discountType === "flat") {
      discount = coupon.discountValue;
    }

    // Cap discount at subtotal
    if (discount > Number(subtotal)) {
      discount = Math.round(Number(subtotal));
    }

    return NextResponse.json({
      success: true,
      couponCode: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      discount,
    });
  } catch (error) {
    console.error("Apply Coupon API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error occurred while validating coupon." },
      { status: 500 }
    );
  }
}
