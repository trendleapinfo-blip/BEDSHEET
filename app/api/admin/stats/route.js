import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Order from "@/models/Order";
import Quote from "@/models/Quote";
import SupportTicket from "@/models/SupportTicket";

export async function GET() {
  try {
    await dbConnect();

    const totalUsers = await User.countDocuments();
    const activeSubs = await Order.countDocuments({ status: "ACTIVE" });

    // Sum finalPrice of active subscriptions
    const revenueResult = await Order.aggregate([
      { $match: { status: "ACTIVE" } },
      { $group: { _id: null, total: { $sum: "$finalPrice" } } }
    ]);
    const totalRevenue = revenueResult[0]?.total || 6; // default fallback if empty

    const totalTickets = await SupportTicket.countDocuments();
    const connectionCount = await Quote.countDocuments({ type: "connection" });
    const quotationCount = await Quote.countDocuments({ type: "quotation" });

    return NextResponse.json({
      totalUsers,
      activeSubscriptions: activeSubs,
      totalRevenue,
      monthlyGrowth: -100, // mock data as requested
      connectionRequests: connectionCount,
      quotationRequests: quotationCount,
      totalQuotes: connectionCount + quotationCount,
      supportTickets: totalTickets,
    });
  } catch (error) {
    console.error("Fetch Stats Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
