import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Bundle from "@/models/Bundle";
import Order from "@/models/Order";
import Category from "@/models/Category";

export async function POST(request) {
  try {
    await dbConnect();
    const { qrCode, bundleId, action, condition } = await request.json();
    // action: "DISPATCH", "DELIVER", "COLLECT_RETURN"

    if (!bundleId || !action) {
      return NextResponse.json({ error: "Bundle ID and Action are required" }, { status: 400 });
    }

    const bundle = await Bundle.findOne({ bundleId });
    if (!bundle) {
      return NextResponse.json({ error: "Bundle not found" }, { status: 404 });
    }

    if (action === "DISPATCH") {
      bundle.status = "DISPATCHED";
      bundle.logisticsHistory.push({ action: "Dispatched by Logistics", operator: "Logistics Scanner" });
      
      // Sync Order
      if (bundle.orderId) {
        if (bundle.orderId.match(/^[0-9a-fA-F]{24}$/)) {
          await Order.findByIdAndUpdate(bundle.orderId, { status: "ACTIVE" });
        } else {
          await Order.findOneAndUpdate({ bundleOrderId: bundle.orderId }, { status: "ACTIVE" });
        }
      }

      // Decrease available, increase rented
      const category = await Category.findOne({ name: bundle.bedType });
      if (category) {
        category.availableStock = Math.max(0, (category.availableStock || 0) - 1);
        category.rentedStock = (category.rentedStock || 0) + 1;
        await category.save();
      }
    } else if (action === "DELIVER") {
      bundle.status = "DELIVERED";
      bundle.logisticsHistory.push({ action: "Delivered to Customer", operator: "Logistics Scanner" });
      
      // Sync Order
      if (bundle.orderId) {
        if (bundle.orderId.match(/^[0-9a-fA-F]{24}$/)) {
          await Order.findByIdAndUpdate(bundle.orderId, { status: "DELIVERED" });
        } else {
          await Order.findOneAndUpdate({ bundleOrderId: bundle.orderId }, { status: "DELIVERED" });
        }
      }
    } else if (action === "COLLECT_RETURN") {
      if (!qrCode) return NextResponse.json({ error: "QR Code is required for returns" }, { status: 400 });

      // Find the specific item in the bundle
      const itemToReturn = bundle.items.find(i => i.qrCode === qrCode);
      if (!itemToReturn) {
        return NextResponse.json({ error: "Item not found in this bundle" }, { status: 404 });
      }

      // Add to returned items
      bundle.returnedItems.push({
        sku: itemToReturn.sku,
        qrCode: itemToReturn.qrCode,
        itemType: itemToReturn.itemType,
        condition: condition || "GOOD"
      });

      bundle.status = "SENT_TO_LAUNDRY";
      bundle.items = bundle.items.map(i => ({ ...i.toObject(), laundryStatus: "PENDING_WASH" }));
      bundle.logisticsHistory.push({ action: `Collected returned item (QR: ${qrCode})`, operator: "Logistics Scanner" });

      // Move inventory from rented to laundry
      const category = await Category.findOne({ name: bundle.bedType });
      if (category) {
        category.rentedStock = Math.max(0, (category.rentedStock || 0) - 1);
        category.laundryStock = (category.laundryStock || 0) + 1;
        await category.save();
      }
    }

    await bundle.save();
    return NextResponse.json({ success: true, message: `Bundle ${action} successful`, bundle });
  } catch (error) {
    console.error("Logistics Scan Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
