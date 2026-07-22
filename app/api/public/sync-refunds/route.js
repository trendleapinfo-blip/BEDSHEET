import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Order from "@/models/Order";
import Refund from "@/models/Refund";

export async function GET() {
  try {
    await dbConnect();
    const now = new Date();

    const createdClaims = [];

    // 1. Sync expired/cancelled Orders with a security deposit
    const expiredOrders = await Order.find({
      $or: [
        { endDate: { $lte: now } },
        { status: { $in: ["CANCELLED", "EXPIRED"] } }
      ],
      depositCharged: { $gt: 0 }
    });

    for (const order of expiredOrders) {
      const existingRefund = await Refund.findOne({
        $or: [{ userId: order.userId }, { userEmail: order.email }],
        planName: order.bundleName
      });

      if (!existingRefund) {
        const refund = await Refund.create({
          userId: order.userId || "GUEST",
          userName: order.userName || "Valued Customer",
          userEmail: order.email,
          userPhone: order.phone || "",
          planName: order.bundleName,
          depositAmount: order.depositCharged,
          status: "PENDING",
          cancelledAt: order.endDate || order.updatedAt || new Date()
        });
        createdClaims.push(refund);
      }
    }

    // 2. Sync expired Users with a selectedPlan security deposit
    const expiredUsers = await User.find({
      "selectedPlan.planName": { $exists: true, $ne: "" },
      "selectedPlan.securityDeposit": { $gt: 0 },
      "selectedPlan.endDate": { $lte: now }
    });

    for (const u of expiredUsers) {
      const existingRefund = await Refund.findOne({
        $or: [{ userId: u._id.toString() }, { userEmail: u.email }],
        planName: u.selectedPlan.planName
      });

      if (!existingRefund) {
        const refund = await Refund.create({
          userId: u._id.toString(),
          userName: u.name,
          userEmail: u.email,
          userPhone: u.mobile || "",
          planName: u.selectedPlan.planName,
          depositAmount: u.selectedPlan.securityDeposit,
          status: "PENDING",
          cancelledAt: u.selectedPlan.endDate || new Date()
        });
        createdClaims.push(refund);
      }
    }

    const totalRefunds = await Refund.find({}).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      message: `Refund sync completed. Created ${createdClaims.length} new deposit return claims. Total claims in database: ${totalRefunds.length}.`,
      createdClaims,
      totalRefunds
    });
  } catch (error) {
    console.error("Sync Refunds Public API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
