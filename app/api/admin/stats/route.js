import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Order from "@/models/Order";
import Quote from "@/models/Quote";
import SupportTicket from "@/models/SupportTicket";
import { verifyAdmin } from "@/lib/adminAuth";

export async function GET() {
  try {
    const admin = await verifyAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Forbidden. Admin access required." }, { status: 403 });
    }

    await dbConnect();

    const totalUsers = await User.countDocuments({ role: { $ne: "admin" } });
    const activeSubs = await Order.countDocuments({ status: "ACTIVE" });

    // Sum finalPrice of active subscriptions
    const activeRevenueResult = await Order.aggregate([
      { $match: { status: "ACTIVE" } },
      { $group: { _id: null, total: { $sum: "$finalPrice" } } }
    ]);
    const totalRevenue = activeRevenueResult[0]?.total || 0;

    const totalTickets = await SupportTicket.countDocuments();
    const connectionCount = await Quote.countDocuments({ type: "connection" });
    const quotationCount = await Quote.countDocuments({ type: "quotation" });

    // Calculate AOV (Average Order Value)
    const allOrders = await Order.find({});
    const totalOrderCount = allOrders.length;
    const sumOrderRevenue = allOrders.reduce((sum, o) => sum + (o.finalPrice || 0), 0);
    const aov = totalOrderCount > 0 ? Math.round(sumOrderRevenue / totalOrderCount) : 0;

    // Calculate LTV (Lifetime Value)
    const ltv = totalUsers > 0 ? Math.round(sumOrderRevenue / totalUsers) : 0;

    // Calculate Monthly Churn Rate
    const cancelledCount = await Order.countDocuments({ status: "CANCELLED" });
    const activeCount = await Order.countDocuments({ status: "ACTIVE" });
    const churnRate = (activeCount + cancelledCount) > 0 ? parseFloat(((cancelledCount / (activeCount + cancelledCount)) * 100).toFixed(1)) : 0;

    // Calculate Monthly Revenue Trend (last 6 months)
    const revenueTrend = [];
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const today = new Date();

    for (let i = 5; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const startOfMonth = new Date(d.getFullYear(), d.getMonth(), 1);
      const endOfMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
      
      const monthRevenueResult = await Order.aggregate([
        {
          $match: {
            startDate: { $gte: startOfMonth, $lte: endOfMonth }
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$finalPrice" }
          }
        }
      ]);
      
      const monthRevenue = monthRevenueResult[0]?.total || 0;
      revenueTrend.push({
        month: monthNames[d.getMonth()],
        amount: parseFloat((monthRevenue / 1000).toFixed(1)) // in thousands (k)
      });
    }

    // Calculate Cohort Retention Analysis
    const cohortsMap = {};
    const allUsers = await User.find({ role: { $ne: "admin" } });

    allUsers.forEach(u => {
      if (!u.createdAt) return;
      const date = new Date(u.createdAt);
      const cohortKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (!cohortsMap[cohortKey]) {
        cohortsMap[cohortKey] = [];
      }
      cohortsMap[cohortKey].push(u);
    });

    const cohortsList = [];
    const cohortKeys = Object.keys(cohortsMap).sort(); // Chronological order

    for (const key of cohortKeys) {
      const usersInCohort = cohortsMap[key];
      const [year, month] = key.split("-").map(Number);
      const cohortDate = new Date(year, month - 1, 1);
      const cohortLabel = cohortDate.toLocaleDateString("en-US", { month: "short", year: "numeric" });
      
      const size = usersInCohort.length;
      if (size === 0) continue;
      
      const retentionRow = {
        month: cohortLabel,
        size: `${size} users`,
        m0: 100, // Month 0 is always 100%
        m1: 0,
        m2: 0,
        m3: 0,
        m4: 0
      };
      
      for (let m = 1; m <= 4; m++) {
        const startRange = new Date(year, month - 1 + m, 1);
        const endRange = new Date(year, month - 1 + m + 1, 0, 23, 59, 59, 999);
        
        if (startRange > today) {
          retentionRow[`m${m}`] = null;
          continue;
        }
        
        let activeUsersCount = 0;
        for (const u of usersInCohort) {
          const orderCount = await Order.countDocuments({
            email: u.email,
            startDate: { $gte: startRange, $lte: endRange }
          });
          if (orderCount > 0) {
            activeUsersCount++;
          }
        }
        
        retentionRow[`m${m}`] = Math.round((activeUsersCount / size) * 100);
      }
      
      cohortsList.push(retentionRow);
    }

    // Average Month 1 retention across all cohorts
    const validCohortM1s = cohortsList.filter(c => c.m1 !== null).map(c => c.m1);
    const retentionRate = validCohortM1s.length > 0 ? parseFloat((validCohortM1s.reduce((a, b) => a + b, 0) / validCohortM1s.length).toFixed(1)) : 0;

    return NextResponse.json({
      totalUsers,
      activeSubscriptions: activeSubs,
      totalRevenue,
      monthlyGrowth: 0, // dynamic placeholder or can be left 0
      connectionRequests: connectionCount,
      quotationRequests: quotationCount,
      totalQuotes: connectionCount + quotationCount,
      supportTickets: totalTickets,
      aov,
      ltv,
      retentionRate,
      churnRate,
      cohorts: cohortsList,
      revenueTrend
    });
  } catch (error) {
    console.error("Fetch Stats Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
