import { NextResponse } from "next/server";
import dbConnect from "../../../../lib/db";
import Analytics from "../../../../models/Analytics";

export async function GET(req) {
  try {
    await dbConnect();

    // 1. Total Visitors (unique session IDs)
    const uniqueVisitors = await Analytics.distinct("sessionId");
    const totalVisitors = uniqueVisitors.length;

    // 2. Total Page Views (excluding PWA_INSTALL events)
    const totalViews = await Analytics.countDocuments({ path: { $ne: "PWA_INSTALL" } });

    // 3. Total PWA Installs
    const pwaInstalls = await Analytics.countDocuments({ isPwaInstall: true });

    // 4. Page Breakdown
    const pageBreakdown = await Analytics.aggregate([
      { $match: { path: { $ne: "PWA_INSTALL" } } },
      { $group: { _id: "$path", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // 5. Referrer Breakdown
    const referrers = await Analytics.aggregate([
      { $match: { path: { $ne: "PWA_INSTALL" } } },
      { $group: { _id: "$referrer", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    return NextResponse.json({
      success: true,
      data: {
        totalVisitors,
        totalViews,
        pwaInstalls,
        pageBreakdown,
        referrers
      }
    });

  } catch (error) {
    console.error("Failed to fetch analytics:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch" }, { status: 500 });
  }
}
