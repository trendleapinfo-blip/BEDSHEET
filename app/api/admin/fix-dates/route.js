import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Order from "@/models/Order";

export async function GET() {
  try {
    await dbConnect();

    const users = await User.find({ "selectedPlan.planName": { $exists: true, $ne: "" } });
    const updatedUsers = [];
    const updatedOrders = [];

    for (const user of users) {
      if (!user.selectedPlan || !user.selectedPlan.startDate) continue;

      const startDate = new Date(user.selectedPlan.startDate);
      let endDate = user.selectedPlan.endDate ? new Date(user.selectedPlan.endDate) : new Date(startDate);

      // Calculate endDate if not explicitly set
      const dur = (user.selectedPlan.duration || "1 Month").toLowerCase();
      endDate = new Date(startDate);
      if (dur.includes("3 month") || dur.includes("quarterly")) {
        endDate.setMonth(endDate.getMonth() + 3);
      } else if (dur.includes("6 month") || dur.includes("half")) {
        endDate.setMonth(endDate.getMonth() + 6);
      } else if (dur.includes("12 month") || dur.includes("year") || dur.includes("annual")) {
        endDate.setFullYear(endDate.getFullYear() + 1);
      } else {
        endDate.setMonth(endDate.getMonth() + 1);
      }

      // Update user selectedPlan endDate in MongoDB
      user.selectedPlan.endDate = endDate;
      await user.save();

      updatedUsers.push({
        email: user.email,
        name: user.name,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      });

      // Update matching orders in MongoDB
      const matchingOrders = await Order.find({
        $or: [{ userId: user._id.toString() }, { email: user.email }],
      });

      for (const order of matchingOrders) {
        order.endDate = endDate;
        await order.save();
        updatedOrders.push({
          bundleOrderId: order.bundleOrderId,
          email: order.email,
          endDate: endDate.toISOString(),
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Successfully updated ${updatedUsers.length} user selectedPlans and ${updatedOrders.length} orders with exact end dates in MongoDB.`,
      updatedUsers,
      updatedOrders,
    });
  } catch (error) {
    console.error("Fix Dates API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST() {
  return GET();
}
