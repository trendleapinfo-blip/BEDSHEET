import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import StaffApproval from "@/models/StaffApproval";
import User from "@/models/User";

export async function POST(request) {
  try {
    await dbConnect();
    const { name, email, mobile, role } = await request.json();

    // Validations
    if (!name || !email || !mobile || !role) {
      return NextResponse.json(
        { error: "Name, email, mobile number, and role are required fields." },
        { status: 400 }
      );
    }

    if (role !== "WH" && role !== "LP") {
      return NextResponse.json(
        { error: "Invalid role selected. Role must be Warehouse Manager or Logistics Partner." },
        { status: 400 }
      );
    }

    const emailLower = email.toLowerCase().trim();

    // Check if user login account already exists
    const existingUser = await User.findOne({ email: emailLower });
    if (existingUser) {
      return NextResponse.json(
        { error: "A login account with this email address already exists." },
        { status: 400 }
      );
    }

    // Check if staff registration already exists
    const existingStaff = await StaffApproval.findOne({ email: emailLower });
    if (existingStaff) {
      if (existingStaff.status === "PENDING") {
        return NextResponse.json(
          { error: "A registration request for this email is already pending approval." },
          { status: 400 }
        );
      } else if (existingStaff.status === "APPROVED") {
        return NextResponse.json(
          { error: "This email has already been approved. Please ask the administrator to provision your credentials." },
          { status: 400 }
        );
      } else {
        return NextResponse.json(
          { error: "A registration request for this email was previously rejected." },
          { status: 400 }
        );
      }
    }

    // Check if mobile number is already in use
    const existingUserMobile = await User.findOne({ mobile: mobile.trim() });
    const existingStaffMobile = await StaffApproval.findOne({ mobile: mobile.trim() });
    if (existingUserMobile || existingStaffMobile) {
      return NextResponse.json(
        { error: "This mobile number is already registered in the system." },
        { status: 400 }
      );
    }

    // Create Staff Approval Record
    const newStaff = await StaffApproval.create({
      name: name.trim(),
      email: emailLower,
      mobile: mobile.trim(),
      role,
      status: "PENDING",
      registeredAt: new Date()
    });

    return NextResponse.json({
      success: true,
      message: "Staff registration request submitted successfully! Please wait for administrator approval.",
      staff: {
        id: newStaff._id,
        name: newStaff.name,
        email: newStaff.email,
        role: newStaff.role,
        status: newStaff.status
      }
    }, { status: 201 });

  } catch (error) {
    console.error("Staff Registration API Error:", error);
    return NextResponse.json(
      { error: "An internal server error occurred while processing your registration." },
      { status: 500 }
    );
  }
}
