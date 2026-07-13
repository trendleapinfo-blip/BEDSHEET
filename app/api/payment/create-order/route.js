import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Razorpay from "razorpay";

export async function POST(request) {
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

    const body = await request.json();
    const { totalPrice } = body;

    if (!totalPrice || isNaN(totalPrice) || totalPrice <= 0) {
      return NextResponse.json({ error: "Invalid payable amount." }, { status: 400 });
    }

    await dbConnect();
    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const key_id = process.env.RAZORPAY_KEY_ID || "rzp_live_SEHTPEZotHKWW1";
    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    if (!key_secret) {
      return NextResponse.json({ error: "Razorpay keys are not configured in environment variables." }, { status: 500 });
    }

    const razorpay = new Razorpay({
      key_id,
      key_secret,
    });

    const options = {
      amount: Math.round(Number(totalPrice) * 100), // in paise
      currency: "INR",
      receipt: `rcpt_${Date.now()}_${decoded.userId.toString().slice(-6)}`,
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({
      success: true,
      keyId: key_id,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      user: {
        name: user.name,
        email: user.email,
        mobile: user.mobile || "",
      }
    });

  } catch (error) {
    console.error("Create Razorpay Order Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to initialize Razorpay payment order." },
      { status: 500 }
    );
  }
}
