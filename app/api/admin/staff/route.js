import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import StaffApproval from "@/models/StaffApproval";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    await dbConnect();
    const staff = await StaffApproval.find({}).sort({ registeredAt: -1 });
    return NextResponse.json({ staff });
  } catch (error) {
    console.error("Fetch Staff Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const { name, email, mobile, role, status } = await request.json();

    if (!name || !email || !mobile || !role) {
      return NextResponse.json({ error: "Name, email, mobile, and role are required" }, { status: 400 });
    }

    const newStaff = await StaffApproval.create({
      name,
      email,
      mobile,
      role,
      status: status || "PENDING",
    });

    return NextResponse.json({ success: true, staff: newStaff });
  } catch (error) {
    console.error("Create Staff Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    await dbConnect();
    const { staffId, status } = await request.json();

    if (!staffId || !status) {
      return NextResponse.json({ error: "Staff ID and status are required" }, { status: 400 });
    }

    const updated = await StaffApproval.findByIdAndUpdate(staffId, { status }, { new: true });
    if (!updated) {
      return NextResponse.json({ error: "Staff record not found" }, { status: 404 });
    }

    // Auto-create user login account if approved
    if (status === "APPROVED") {
      const existingUser = await User.findOne({ email: updated.email });
      if (!existingUser) {
        const hashedPassword = await bcrypt.hash("staffpassword", 10);
        const mappedRole = updated.role === "WH" ? "warehouse" : "logistics";
        await User.create({
          name: updated.name,
          email: updated.email,
          mobile: updated.mobile,
          password: hashedPassword,
          role: mappedRole,
          status: "ACTIVE",
          accountType: "Individual User"
        });
      }
    }

    return NextResponse.json({ success: true, staff: updated });
  } catch (error) {
    console.error("Update Staff Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const staffId = searchParams.get("staffId");

    if (!staffId) {
      return NextResponse.json({ error: "Staff ID is required" }, { status: 400 });
    }

    const deleted = await StaffApproval.findByIdAndDelete(staffId);
    if (!deleted) {
      return NextResponse.json({ error: "Staff record not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Staff record deleted successfully" });
  } catch (error) {
    console.error("Delete Staff Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
