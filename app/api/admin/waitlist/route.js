import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Waitlist from "@/models/Waitlist";
import { verifyAdmin } from "@/lib/adminAuth";

export async function GET() {
  try {
    const admin = await verifyAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Forbidden. Admin access required." }, { status: 403 });
    }

    await dbConnect();
    const waitlist = await Waitlist.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, waitlist });
  } catch (error) {
    console.error("Fetch Admin Waitlist Error:", error);
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
    const { id, status } = await request.json();

    if (!id || !status) {
      return NextResponse.json({ error: "ID and Status are required." }, { status: 400 });
    }

    const updated = await Waitlist.findByIdAndUpdate(id, { status }, { new: true });
    if (!updated) {
      return NextResponse.json({ error: "Waitlist entry not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, entry: updated });
  } catch (error) {
    console.error("Update Admin Waitlist Error:", error);
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
      return NextResponse.json({ error: "Waitlist entry ID is required." }, { status: 400 });
    }

    const deleted = await Waitlist.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: "Waitlist entry not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Waitlist entry deleted successfully." });
  } catch (error) {
    console.error("Delete Admin Waitlist Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
