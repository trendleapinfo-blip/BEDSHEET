import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Refund from "@/models/Refund";
import { verifyAdmin } from "@/lib/adminAuth";

export async function GET() {
  try {
    const admin = await verifyAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Forbidden. Admin access required." }, { status: 403 });
    }

    await dbConnect();
    const refunds = await Refund.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, refunds });
  } catch (error) {
    console.error("Fetch Admin Refunds Error:", error);
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
    const { id, status, transactionId } = await request.json();

    if (!id || !status) {
      return NextResponse.json({ error: "ID and Status are required." }, { status: 400 });
    }

    const updateData = { status };
    if (status === "REFUNDED") {
      updateData.refundedAt = new Date();
      if (transactionId) {
        updateData.transactionId = transactionId;
      }
    }

    const updated = await Refund.findByIdAndUpdate(id, updateData, { new: true });
    if (!updated) {
      return NextResponse.json({ error: "Refund claim not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, refund: updated });
  } catch (error) {
    console.error("Update Admin Refund Error:", error);
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
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Refund claim ID is required." }, { status: 400 });
    }

    const deleted = await Refund.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: "Refund claim not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Refund claim deleted successfully." });
  } catch (error) {
    console.error("Delete Admin Refund Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
