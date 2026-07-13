import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Order from "@/models/Order";
import Coupon from "@/models/Coupon";
import BrandSettings from "@/models/BrandSettings";
import { sendOrderConfirmationEmail } from "@/lib/mailer";

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
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderDetails
    } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !orderDetails) {
      return NextResponse.json({ error: "Missing verification parameters." }, { status: 400 });
    }

    const key_secret = process.env.RAZORPAY_KEY_SECRET;
    if (!key_secret) {
      return NextResponse.json({ error: "Razorpay key secret configuration is missing on the server." }, { status: 500 });
    }

    // Verify payment signature
    const hmac = crypto.createHmac("sha256", key_secret);
    hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
    const generated_signature = hmac.digest("hex");

    if (generated_signature !== razorpay_signature) {
      return NextResponse.json({ error: "Payment verification failed: Signature mismatch." }, { status: 400 });
    }

    // Signature verified! Save the order to Database
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
      isCustom,
      couponCode,
      discount,
      orderType,
      itemTier
    } = orderDetails;

    await dbConnect();

    // Fetch user
    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    // Server-side validation of Coupon
    let calculatedDiscount = 0;
    let coupon = null;
    if (couponCode) {
      if (user.accountType !== "Individual User") {
        return NextResponse.json({ error: "Coupons are only available for B2C Individual Users." }, { status: 400 });
      }
      const uppercaseCode = couponCode.trim().toUpperCase();
      coupon = await Coupon.findOne({ code: uppercaseCode });
      if (coupon && coupon.isActive) {
        if (coupon.discountType === "percentage") {
          calculatedDiscount = Math.round(Number(price) * (coupon.discountValue / 100));
          if (coupon.maxDiscount !== null && calculatedDiscount > coupon.maxDiscount) {
            calculatedDiscount = coupon.maxDiscount;
          }
        } else if (coupon.discountType === "flat") {
          calculatedDiscount = coupon.discountValue;
        }
        if (calculatedDiscount > Number(price)) {
          calculatedDiscount = Math.round(Number(price));
        }
      }
    }

    // Fetch Brand Settings to check dynamic security deposits
    const settings = await BrandSettings.findOne();
    const singleDeposit = settings?.singleBedDeposit ?? 500;
    const doubleDeposit = settings?.doubleBedDeposit ?? 800;
    const isSingleBed = (bedType || "").toLowerCase().includes("single");
    const baseDeposit = isSingleBed ? singleDeposit : doubleDeposit;

    const computedDeposit = (orderType === "BUY") ? 0 : ((subscriptionType === "weekly") ? 0 : baseDeposit);
    const discountedBase = Number(price) - calculatedDiscount;
    const computedGst = Math.round(discountedBase * 0.18);
    const computedTotalPrice = discountedBase + computedGst + computedDeposit;

    const updateFields = {
      selectedPlan: {
        bedType,
        planName,
        price: Number(price),
        duration,
        subscriptionType: subscriptionType || "monthly",
        securityDeposit: computedDeposit,
        gst: computedGst,
        totalPrice: computedTotalPrice,
        startDate: new Date(),
        isCustom: !!isCustom,
        color,
        fabric,
        print,
        couponCode: coupon ? coupon.code : null,
        discount: calculatedDiscount,
        orderType: orderType || "RENT",
        itemTier: itemTier || "BASIC"
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

    // Calculate End Date
    let endDate = new Date();
    if (orderType === "BUY") {
      endDate = null;
    } else {
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
    }

    // Generate bundleOrderId
    const codePrefix = isSingleBed ? "SIN" : "DOU";
    let bundleOrderId = "";
    let bundleName = "";

    if (orderType === "BUY") {
      bundleOrderId = `B${codePrefix}PUR-${Math.floor(10000 + Math.random() * 90000)}`;
      bundleName = `${bedType} Sheets (${itemTier === "PREMIUM" ? "Premium Set" : "Basic Set"})`;
    } else {
      const subPrefix = (subscriptionType || "monthly") === "weekly" ? "WK" : "MO";
      bundleOrderId = `B${codePrefix}BUN-${subPrefix}-${Math.floor(10000 + Math.random() * 90000)}`;
      bundleName = `${bedType} ${
        subscriptionType === "weekly" ? "Weekly Change Service" : "Bundle"
      }`;
    }

    if (color || fabric || print) {
      const customizations = [color, fabric, print].filter(Boolean).join(", ");
      bundleName += ` Custom (${customizations})`;
    }

    // Create a new Order in Database
    const newOrder = await Order.create({
      bundleOrderId,
      userId: updatedUser._id.toString(),
      userName: updatedUser.name,
      phone: updatedUser.mobile || "—",
      email: updatedUser.email,
      bundleName,
      duration,
      durationMonths: duration === "1 Month" ? 1 : duration === "3 Months" ? 3 : duration === "6 Months" ? 6 : duration === "9 Months" ? 9 : 12,
      calculatedRent: Number(price),
      depositCharged: computedDeposit,
      totalAmount: computedTotalPrice,
      finalPrice: computedTotalPrice,
      couponCode: coupon ? coupon.code : null,
      discount: calculatedDiscount,
      status: "ACTIVE", // Verified and paid
      orderType: orderType || "RENT",
      itemTier: itemTier || "BASIC",
      orderCategory: "B2C",
      frequency: subscriptionType === "weekly" ? "WEEKLY_SWAP" : "MONTHLY_SWAP",
      startDate: new Date(),
      endDate,
      deliveryAddress: updatedUser.address || "—",
      razorpayPaymentId: razorpay_payment_id,
      razorpayOrderId: razorpay_order_id
    });

    if (coupon) {
      await Coupon.findByIdAndUpdate(coupon._id, { $inc: { usedCount: 1 } });
    }

    // Send beautiful email confirmation to the user
    try {
      await sendOrderConfirmationEmail(updatedUser.email, {
        userName: updatedUser.name,
        bundleOrderId: newOrder.bundleOrderId,
        bundleName: newOrder.bundleName,
        orderType: newOrder.orderType,
        subscriptionType: newOrder.frequency === "WEEKLY_SWAP" ? "weekly" : "monthly",
        price: newOrder.calculatedRent,
        securityDeposit: newOrder.depositCharged,
        gst: computedGst,
        discount: newOrder.discount,
        totalPrice: newOrder.finalPrice,
        deliveryAddress: newOrder.deliveryAddress,
        startDate: newOrder.startDate,
        duration: newOrder.duration,
      });
    } catch (emailErr) {
      console.error("Order Confirmation Email failed to send:", emailErr);
    }

    return NextResponse.json({
      success: true,
      message: "Payment verified and order created successfully.",
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
    console.error("Payment Verification API Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error occurred during payment verification." },
      { status: 500 }
    );
  }
}
