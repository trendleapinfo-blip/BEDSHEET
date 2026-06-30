import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Otp from "@/models/Otp";

export async function POST(request) {
  try {
    await dbConnect();
    const { email, mobile, emailOrMobile, purpose } = await request.json();

    // Determine target email or mobile
    let target = emailOrMobile || email || mobile;
    if (!target) {
      return NextResponse.json(
        { error: "Email or mobile number is required." },
        { status: 400 }
      );
    }
    target = target.trim().toLowerCase();

    if (!purpose || !["login", "signup", "reset_password"].includes(purpose)) {
      return NextResponse.json(
        { error: "A valid purpose (login, signup, or reset_password) is required." },
        { status: 400 }
      );
    }

    // Check user existence based on purpose
    let query = {};
    if (target.includes("@")) {
      query = { email: target };
    } else {
      query = { mobile: target };
    }

    const existingUser = await User.findOne(query);

    if (purpose === "signup" && existingUser) {
      return NextResponse.json(
        { error: "An account with this email/mobile already exists." },
        { status: 400 }
      );
    }

    if ((purpose === "login" || purpose === "reset_password") && !existingUser) {
      return NextResponse.json(
        { error: "No account found with this email/mobile." },
        { status: 400 }
      );
    }

    // Generate 6-digit random code
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Save/update OTP in database
    await Otp.findOneAndUpdate(
      { emailOrMobile: target, purpose },
      { code, createdAt: new Date() },
      { upsert: true, new: true }
    );

    // Print to console for development testing
    console.log("\n========================================");
    console.log(`[OTP SERVICE] Purpose: ${purpose.toUpperCase()}`);
    console.log(`[OTP SERVICE] Send To: ${target}`);
    console.log(`[OTP SERVICE] Verification Code: ${code}`);
    console.log("========================================\n");

    // Return response. In dev/production, we return the code in body so frontend dev-mode can show it.
    return NextResponse.json(
      {
        message: "Verification code sent successfully.",
        code, // Return code so frontend can display a Dev Mode banner for testing
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Send OTP Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error occurred while sending verification code." },
      { status: 500 }
    );
  }
}
