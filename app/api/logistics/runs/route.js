import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Order from "@/models/Order";
import Bundle from "@/models/Bundle";

// Helper to verify logistics/admin/warehouse role
async function verifyLogisticsAccess() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return null;

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret");
    await dbConnect();
    const user = await User.findById(decoded.userId);
    if (user && (user.role === "admin" || user.role === "warehouse" || user.role === "logistics")) {
      return user;
    }
    return null;
  } catch (error) {
    return null;
  }
}

// GET: Fetch all bundles with their associated order details for the logistics run sheet
export async function GET() {
  try {
    const user = await verifyLogisticsAccess();
    if (!user) {
      return NextResponse.json({ error: "Forbidden. Logistics access required." }, { status: 403 });
    }

    await dbConnect();

    // Fetch all bundles (these represent physical shipments)
    const bundles = await Bundle.find({}).sort({ createdAt: -1 });

    // Fetch matching orders for each bundle
    const orderIds = bundles.map(b => b.orderId).filter(Boolean);
    const orders = await Order.find({ _id: { $in: orderIds } });

    // Build a map for quick lookup
    const orderMap = {};
    orders.forEach(o => {
      orderMap[o._id.toString()] = o;
    });

    // Combine bundle + order data into shipment records
    const shipments = bundles.map(bundle => {
      const order = orderMap[bundle.orderId] || {};
      return {
        _id: bundle._id,
        bundleId: bundle.bundleId,
        orderId: bundle.orderId,
        bundleOrderId: order.bundleOrderId || "—",
        bundleName: order.bundleName || bundle.bedType,
        customerName: bundle.customerName || order.userName || "—",
        phone: order.phone || "—",
        email: order.email || "—",
        deliveryAddress: order.deliveryAddress || "—",
        color: bundle.color || "Classic White",
        bedType: bundle.bedType,
        orderType: order.orderType || "RENT",
        finalPrice: order.finalPrice || 0,
        startDate: order.startDate || bundle.createdAt,
        orderStatus: order.status || "—",
        bundleStatus: bundle.status,
        items: bundle.items || [],
        logisticsHistory: bundle.logisticsHistory || [],
        createdAt: bundle.createdAt,
      };
    });

    return NextResponse.json({ success: true, shipments });
  } catch (error) {
    console.error("Logistics Runs Fetch Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT: Update shipment/bundle status from logistics panel
export async function PUT(request) {
  try {
    const user = await verifyLogisticsAccess();
    if (!user) {
      return NextResponse.json({ error: "Forbidden. Logistics access required." }, { status: 403 });
    }

    await dbConnect();
    const { bundleId, action } = await request.json();

    if (!bundleId || !action) {
      return NextResponse.json({ error: "Bundle ID and action are required." }, { status: 400 });
    }

    const bundle = await Bundle.findOne({ bundleId });
    if (!bundle) {
      return NextResponse.json({ error: "Bundle not found." }, { status: 404 });
    }

    const operatorName = user.name || "Logistics Partner";
    
    if (action === "DELIVERED") {
      bundle.status = "DELIVERED";
      bundle.logisticsHistory.push({
        action: "Delivered to Customer",
        operator: operatorName,
      });
      await bundle.save();

      // Sync the order status
      await Order.findByIdAndUpdate(bundle.orderId, { status: "DELIVERED" });

      return NextResponse.json({ success: true, message: "Shipment marked as Delivered." });
    }

    if (action === "CANCELLED") {
      bundle.status = "SENT_TO_LAUNDRY";
      bundle.items = bundle.items.map(item => ({
        ...item.toObject(),
        laundryStatus: "PENDING_WASH",
      }));
      bundle.logisticsHistory.push({
        action: "Delivery cancelled/returned. Bundle routed to laundry dock.",
        operator: operatorName,
      });
      await bundle.save();

      // Sync the order status
      await Order.findByIdAndUpdate(bundle.orderId, { status: "CANCELLED" });

      return NextResponse.json({ success: true, message: "Shipment cancelled. Bundle routed to laundry." });
    }

    return NextResponse.json({ error: "Invalid action. Use DELIVERED or CANCELLED." }, { status: 400 });
  } catch (error) {
    console.error("Logistics Status Update Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
