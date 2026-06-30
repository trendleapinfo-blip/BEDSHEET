import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Otp from "@/models/Otp";

export async function POST(request) {
  try {
    await dbConnect();
    const { email, mobile, emailOrMobile, code, newPassword } = await request.json();

    let target = emailOrMobile || email || mobile;
    if (!target || !code || !newPassword) {
      return NextResponse.json(
        { error: "Credentials, verification code, and new password are required." },
        { status: 400 }
      );
    }
    target = target.trim().toLowerCase();

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "New password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    // Verify OTP code in the database
    const otpRecord = await Otp.findOne({
      emailOrMobile: target,
      code: code.trim(),
      purpose: "reset_password",
    });

    if (!otpRecord) {
      return NextResponse.json(
        { error: "Invalid or expired verification code." },
        { status: 400 }
      );
    }

    // Find user
    let query = {};
    if (target.includes("@")) {
      query = { email: target };
    } else {
      query = { mobile: target };
    }

    const user = await User.findOne(query);
    if (!user) {
      return NextResponse.json(
        { error: "User account not found." },
        { status: 404 }
      );
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update user's password
    user.password = hashedPassword;
    await user.save();

    // Delete verified OTP record
    await Otp.deleteOne({ _id: otpRecord._id });

    return NextResponse.json(
      { message: "Password reset successfully. You can now log in." },
      { status: 200 }
    );
  } catch (error) {
    console.error("OTP Reset Password Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error occurred while resetting password." },
      { status: 500 }
    );
  }
}
