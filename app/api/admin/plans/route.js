import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Plan from "@/models/Plan";
import { verifyAdmin } from "@/lib/adminAuth";

export async function GET() {
  try {
    const admin = await verifyAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Forbidden. Admin access required." }, { status: 403 });
    }

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
    const admin = await verifyAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Forbidden. Admin access required." }, { status: 403 });
    }

    await dbConnect();
    const {
      tier,
      bedType,
      monthlyRate,
      depositAmount
    } = await request.json();

    if (!tier || !bedType || monthlyRate === undefined || depositAmount === undefined) {
      return NextResponse.json({ error: "Tier, bed type, monthly rate, and deposit amount are required" }, { status: 400 });
    }

    const newPlan = await Plan.create({
      tier,
      bedType,
      monthlyRate: Number(monthlyRate),
      depositAmount: Number(depositAmount)
    });

    return NextResponse.json({ success: true, plan: newPlan });
  } catch (error) {
    console.error("Create Plan Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const admin = await verifyAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Forbidden. Admin access required." }, { status: 403 });
    }

    await dbConnect();
    const {
      planId,
      tier,
      bedType,
      monthlyRate,
      depositAmount
    } = await request.json();

    if (!planId) {
      return NextResponse.json({ error: "Plan ID is required" }, { status: 400 });
    }

    const updateData = {};
    if (tier !== undefined) updateData.tier = tier;
    if (bedType !== undefined) updateData.bedType = bedType;
    if (monthlyRate !== undefined) updateData.monthlyRate = Number(monthlyRate);
    if (depositAmount !== undefined) updateData.depositAmount = Number(depositAmount);

    const updated = await Plan.findByIdAndUpdate(
      planId,
      updateData,
      { returnDocument: 'after' }
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
    const admin = await verifyAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Forbidden. Admin access required." }, { status: 403 });
    }

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
