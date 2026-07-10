import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Coupon from "@/models/Coupon";
import { verifyAdmin } from "@/lib/adminAuth";

export async function GET() {
  try {
    const admin = await verifyAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Forbidden. Access denied." }, { status: 403 });
    }

    const coupons = await Coupon.find({}).sort({ code: 1 });
    return NextResponse.json({ success: true, coupons }, {
      headers: {
        "Cache-Control": "no-store, max-age=0"
      }
    });
  } catch (error) {
    console.error("Fetch Admin Coupons Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const admin = await verifyAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Forbidden. Access denied." }, { status: 403 });
    }

    const {
      code,
      discountType,
      discountValue,
      minPurchase,
      maxDiscount,
      startDate,
      endDate,
      isActive,
      usageLimit
    } = await request.json();

    if (!code || !discountType || discountValue === undefined) {
      return NextResponse.json({ error: "Code, discount type, and discount value are required" }, { status: 400 });
    }

    const uppercaseCode = code.trim().toUpperCase();

    // Check if code already exists
    const existing = await Coupon.findOne({ code: uppercaseCode });
    if (existing) {
      return NextResponse.json({ error: `Coupon code '${uppercaseCode}' already exists` }, { status: 400 });
    }

    const newCoupon = await Coupon.create({
      code: uppercaseCode,
      discountType,
      discountValue: Number(discountValue),
      minPurchase: minPurchase ? Number(minPurchase) : 0,
      maxDiscount: maxDiscount ? Number(maxDiscount) : null,
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,
      isActive: isActive !== undefined ? !!isActive : true,
      usageLimit: usageLimit ? Number(usageLimit) : null,
      usedCount: 0
    });

    return NextResponse.json({ success: true, coupon: newCoupon });
  } catch (error) {
    console.error("Create Coupon Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const admin = await verifyAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Forbidden. Access denied." }, { status: 403 });
    }

    const {
      couponId,
      code,
      discountType,
      discountValue,
      minPurchase,
      maxDiscount,
      startDate,
      endDate,
      isActive,
      usageLimit
    } = await request.json();

    if (!couponId) {
      return NextResponse.json({ error: "Coupon ID is required" }, { status: 400 });
    }

    const updateData = {};
    if (code !== undefined) updateData.code = code.trim().toUpperCase();
    if (discountType !== undefined) updateData.discountType = discountType;
    if (discountValue !== undefined) updateData.discountValue = Number(discountValue);
    if (minPurchase !== undefined) updateData.minPurchase = Number(minPurchase);
    if (maxDiscount !== undefined) updateData.maxDiscount = maxDiscount ? Number(maxDiscount) : null;
    if (startDate !== undefined) updateData.startDate = startDate ? new Date(startDate) : null;
    if (endDate !== undefined) updateData.endDate = endDate ? new Date(endDate) : null;
    if (isActive !== undefined) updateData.isActive = !!isActive;
    if (usageLimit !== undefined) updateData.usageLimit = usageLimit ? Number(usageLimit) : null;

    // Check code duplication if updating code
    if (updateData.code) {
      const existing = await Coupon.findOne({ code: updateData.code, _id: { $ne: couponId } });
      if (existing) {
        return NextResponse.json({ error: `Coupon code '${updateData.code}' already exists` }, { status: 400 });
      }
    }

    const updated = await Coupon.findByIdAndUpdate(
      couponId,
      updateData,
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: "Coupon not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, coupon: updated });
  } catch (error) {
    console.error("Update Coupon Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const admin = await verifyAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Forbidden. Access denied." }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const couponId = searchParams.get("couponId");

    if (!couponId) {
      return NextResponse.json({ error: "Coupon ID is required" }, { status: 400 });
    }

    const deleted = await Coupon.findByIdAndDelete(couponId);
    if (!deleted) {
      return NextResponse.json({ error: "Coupon not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Coupon deleted successfully" });
  } catch (error) {
    console.error("Delete Coupon Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
