import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Order from "@/models/Order";
import Quote from "@/models/Quote";

export async function GET() {
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

    await dbConnect();

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    // Fetch user orders and quotes
    const orders = await Order.find({
      $or: [{ email: user.email }, { userId: user._id.toString() }],
    }).sort({ createdAt: -1 });

    const quotes = await Quote.find({ email: user.email }).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      user,
      orders,
      quotes,
    });
  } catch (error) {
    console.error("Get Profile API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error occurred while fetching profile." },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
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

    const { name, email, mobile, address, city, pincode, accountType } = await request.json();

    if (!name || !email || !mobile) {
      return NextResponse.json(
        { error: "Name, email, and mobile number are required fields." },
        { status: 400 }
      );
    }

    if (!/^\d{10}$/.test(mobile)) {
      return NextResponse.json(
        { error: "Please enter a valid 10-digit mobile number." },
        { status: 400 }
      );
    }

    await dbConnect();

    // Check if email is already taken by another user
    const emailExists = await User.findOne({ email: email.toLowerCase(), _id: { $ne: decoded.userId } });
    if (emailExists) {
      return NextResponse.json({ error: "Email address is already in use by another account." }, { status: 400 });
    }

    // Check if mobile is already taken by another user
    const mobileExists = await User.findOne({ mobile, _id: { $ne: decoded.userId } });
    if (mobileExists) {
      return NextResponse.json({ error: "Mobile number is already in use by another account." }, { status: 400 });
    }

    const updatedUser = await User.findByIdAndUpdate(
      decoded.userId,
      {
        name,
        email: email.toLowerCase(),
        mobile: mobile || undefined,
        address,
        city,
        pincode,
        accountType,
      },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully.",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update Profile API Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error occurred while updating profile." },
      { status: 500 }
    );
  }
}
