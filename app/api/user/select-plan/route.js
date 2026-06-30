import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Order from "@/models/Order";

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

    const {
      bedType,
      planName,
      price,
      duration,
      subscriptionType,
      securityDeposit,
      gst,
      totalPrice,
      address,
      mobile,
      color,
      fabric,
      print,
      isCustom
    } = await request.json();

    if (!bedType || !planName || price === undefined || !duration) {
      return NextResponse.json(
        { error: "Missing plan configuration details (bedType, planName, price, duration)." },
        { status: 400 }
      );
    }

    await dbConnect();

    // Check if user exists
    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const updateFields = {
      selectedPlan: {
        bedType,
        planName,
        price: Number(price),
        duration,
        subscriptionType: subscriptionType || "monthly",
        securityDeposit: securityDeposit !== undefined ? Number(securityDeposit) : 500,
        gst: gst !== undefined ? Number(gst) : Math.round(Number(price) * 0.18),
        totalPrice: totalPrice !== undefined ? Number(totalPrice) : Number(price) + Math.round(Number(price) * 0.18) + 500,
        startDate: new Date(),
        isCustom: !!isCustom,
        color,
        fabric,
        print
      }
    };

    if (address) {
      updateFields.address = address;
    }
    if (mobile) {
      updateFields.mobile = mobile;
    }

    const updatedUser = await User.findByIdAndUpdate(
      decoded.userId,
      updateFields,
      { new: true }
    ).select("-password");

    // Cancel existing active/pending orders for this user
    await Order.updateMany(
      {
        userId: decoded.userId,
        status: { $in: ["ACTIVE", "PENDING"] },
      },
      { $set: { status: "CANCELLED", endDate: new Date() } }
    );

    // Calculate End Date based on duration
    let endDate = new Date();
    if (duration === "1 Month") {
      endDate.setMonth(endDate.getMonth() + 1);
    } else if (duration === "3 Months") {
      endDate.setMonth(endDate.getMonth() + 3);
    } else if (duration === "6 Months") {
      endDate.setMonth(endDate.getMonth() + 6);
    } else if (duration === "12 Months") {
      endDate.setMonth(endDate.getMonth() + 12);
    } else {
      endDate.setMonth(endDate.getMonth() + 1);
    }

    // Generate dynamic bundleOrderId
    const codePrefix = bedType === "single" ? "SIN" : "DOU";
    const subPrefix = (subscriptionType || "monthly") === "weekly" ? "WK" : "MO";
    const bundleOrderId = `B${codePrefix}BUN-${subPrefix}-${Math.floor(10000 + Math.random() * 90000)}`;

    let bundleName = `${bedType === "single" ? "Single" : "Double"} Bed ${
      subscriptionType === "weekly" ? "Weekly Change Service" : "Bundle"
    }`;

    if (color || fabric || print) {
      const customizations = [color, fabric, print].filter(Boolean).join(", ");
      bundleName += ` Custom (${customizations})`;
    }

    // Create a new Order in Database
    await Order.create({
      bundleOrderId,
      userId: updatedUser._id.toString(),
      userName: updatedUser.name,
      phone: updatedUser.mobile || "—",
      email: updatedUser.email,
      bundleName,
      duration,
      finalPrice: Number(totalPrice || price),
      status: "ACTIVE",
      startDate: new Date(),
      endDate,
      deliveryAddress: updatedUser.address || "—",
    });

    return NextResponse.json({
      message: "Plan selected successfully and order created",
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        mobile: updatedUser.mobile,
        address: updatedUser.address,
        accountType: updatedUser.accountType,
        selectedPlan: updatedUser.selectedPlan,
      },
    });
  } catch (error) {
    console.error("Select Plan API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error occurred while selecting plan." },
      { status: 500 }
    );
  }
}
