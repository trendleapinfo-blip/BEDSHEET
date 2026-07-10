import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Bundle from "@/models/Bundle";
import Order from "@/models/Order";

export async function POST(request) {
  try {
    await dbConnect();
    const { orderId, items } = await request.json();

    if (!orderId || !items || items.length === 0) {
      return NextResponse.json({ error: "Order ID and Items are required" }, { status: 400 });
    }

    const order = await Order.findOne({ bundleOrderId: orderId });
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const bundleId = `BUN-${Date.now().toString().slice(-6)}`;
    
    // Assign QR Codes to items
    const processedItems = items.map(item => ({
      ...item,
      qrCode: `QR-${bundleId}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      laundryStatus: "CLEAN_STOCK"
    }));

    const newBundle = await Bundle.create({
      bundleId,
      orderId: order.bundleOrderId,
      customerName: order.userName,
      bedType: "Mixed", // Could be dynamic
      color: "Assorted", // Could be dynamic
      status: "CREATED",
      items: processedItems,
      logisticsHistory: [{ action: "Bundle Created in Warehouse" }]
    });

    return NextResponse.json({ success: true, bundle: newBundle });
  } catch (error) {
    console.error("Generate Bundle Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
