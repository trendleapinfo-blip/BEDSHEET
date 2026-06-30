import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Plan from "@/models/Plan";

export async function GET() {
  try {
    await dbConnect();
    const plans = await Plan.find({}).sort({ bedType: 1, price: 1 });
    return NextResponse.json({ success: true, plans }, {
      headers: {
        "Cache-Control": "no-store, max-age=0"
      }
    });
  } catch (error) {
    console.error("Fetch Admin Plans Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const {
      bedType,
      name,
      duration,
      price,
      originalPrice,
      discount,
      features,
      cta,
      popular,
      badge
    } = await request.json();

    if (!bedType || !name || !duration || price === undefined) {
      return NextResponse.json({ error: "Bed type, name, duration, and price are required" }, { status: 400 });
    }

    const newPlan = await Plan.create({
      bedType,
      name,
      duration,
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : null,
      discount: discount || null,
      features: Array.isArray(features) ? features : [],
      cta: cta || "Choose Plan",
      popular: !!popular,
      badge: badge || null
    });

    return NextResponse.json({ success: true, plan: newPlan });
  } catch (error) {
    console.error("Create Plan Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    await dbConnect();
    const {
      planId,
      bedType,
      name,
      duration,
      price,
      originalPrice,
      discount,
      features,
      cta,
      popular,
      badge
    } = await request.json();

    if (!planId) {
      return NextResponse.json({ error: "Plan ID is required" }, { status: 400 });
    }

    const updateData = {};
    if (bedType !== undefined) updateData.bedType = bedType;
    if (name !== undefined) updateData.name = name;
    if (duration !== undefined) updateData.duration = duration;
    if (price !== undefined) updateData.price = Number(price);
    if (originalPrice !== undefined) updateData.originalPrice = originalPrice ? Number(originalPrice) : null;
    if (discount !== undefined) updateData.discount = discount || null;
    if (features !== undefined) updateData.features = Array.isArray(features) ? features : [];
    if (cta !== undefined) updateData.cta = cta;
    if (popular !== undefined) updateData.popular = !!popular;
    if (badge !== undefined) updateData.badge = badge || null;

    const updated = await Plan.findByIdAndUpdate(
      planId,
      updateData,
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, plan: updated });
  } catch (error) {
    console.error("Update Plan Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const planId = searchParams.get("planId");

    if (!planId) {
      return NextResponse.json({ error: "Plan ID is required" }, { status: 400 });
    }

    const deleted = await Plan.findByIdAndDelete(planId);
    if (!deleted) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Plan deleted successfully" });
  } catch (error) {
    console.error("Delete Plan Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
