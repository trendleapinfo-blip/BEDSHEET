import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Order from "@/models/Order";

export async function POST() {
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

    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    // Cancel current subscription plan in User model
    user.selectedPlan = undefined;
    await user.save();

    // Cancel active orders for this user in Order model
    await Order.updateMany(
      {
        $or: [{ email: user.email }, { userId: user._id.toString() }],
        status: { $in: ["ACTIVE", "PENDING"] },
      },
      { $set: { status: "CANCELLED", endDate: new Date() } }
    );

    return NextResponse.json({
      success: true,
      message: "Subscription plan cancelled successfully, and active orders updated.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        address: user.address,
        accountType: user.accountType,
        selectedPlan: null,
      },
    });
  } catch (error) {
    console.error("Cancel Plan API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error occurred while cancelling plan." },
      { status: 500 }
    );
  }
}
