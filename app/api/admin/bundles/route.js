import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Bundle from "@/models/Bundle";
import Order from "@/models/Order";
import Category from "@/models/Category";
import { verifyAdmin } from "@/lib/adminAuth";

// GET: Fetch all bundles
export async function GET() {
  try {
    await dbConnect();
    const admin = await verifyAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const bundles = await Bundle.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, bundles });
  } catch (error) {
    console.error("GET bundles error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Create a bundle for an order
export async function POST(request) {
  try {
    await dbConnect();
    const admin = await verifyAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { orderId } = await request.json();
    if (!orderId) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
    }

    // Check if a bundle already exists for this order
    const existingBundle = await Bundle.findOne({ orderId });
    if (existingBundle) {
      return NextResponse.json({ error: "Bundle already exists for this order" }, { status: 400 });
    }

    // Fetch order details
    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Auto-generate items based on bedding type
    const bedTypeLower = order.bundleName.toLowerCase();
    const items = [];
    const colorCode = order.deliveryAddress ? "CLR" : "WHT"; // Mock color code

    if (bedTypeLower.includes("single")) {
      items.push({ sku: `SKU-SHT-${colorCode}-TEMP`, itemType: "Bedsheet", laundryStatus: "CLEAN_STOCK" });
      items.push({ sku: `SKU-PLW-${colorCode}-TEMP`, itemType: "Pillow Cover", laundryStatus: "CLEAN_STOCK" });
    } else if (bedTypeLower.includes("double")) {
      items.push({ sku: `SKU-SHT-${colorCode}-TEMP1`, itemType: "Bedsheet", laundryStatus: "CLEAN_STOCK" });
      items.push({ sku: `SKU-SHT-${colorCode}-TEMP2`, itemType: "Bedsheet", laundryStatus: "CLEAN_STOCK" });
      items.push({ sku: `SKU-PLW-${colorCode}-TEMP1`, itemType: "Pillow Cover", laundryStatus: "CLEAN_STOCK" });
      items.push({ sku: `SKU-PLW-${colorCode}-TEMP2`, itemType: "Pillow Cover", laundryStatus: "CLEAN_STOCK" });
    } else if (bedTypeLower.includes("curtain")) {
      items.push({ sku: `SKU-CRT-${colorCode}-TEMP1`, itemType: "Curtain", laundryStatus: "CLEAN_STOCK" });
      items.push({ sku: `SKU-CRT-${colorCode}-TEMP2`, itemType: "Curtain", laundryStatus: "CLEAN_STOCK" });
    } else if (bedTypeLower.includes("quilt")) {
      items.push({ sku: `SKU-QLT-${colorCode}-TEMP`, itemType: "Quilt", laundryStatus: "CLEAN_STOCK" });
    } else if (bedTypeLower.includes("blanket")) {
      items.push({ sku: `SKU-BKT-${colorCode}-TEMP`, itemType: "Blanket", laundryStatus: "CLEAN_STOCK" });
    } else {
      // Fallback
      items.push({ sku: `SKU-LIN-${colorCode}-TEMP`, itemType: "Linen", laundryStatus: "CLEAN_STOCK" });
    }

    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const bundleId = `BNDL-${randomSuffix}`;

    const newBundle = await Bundle.create({
      bundleId,
      orderId: order._id.toString(),
      customerName: order.userName || "Guest Customer",
      bedType: order.bundleName,
      color: order.deliveryAddress?.split("|")[1] || "Classic White", // Resolve color name if saved in metadata
      status: "CREATED",
      items,
      logisticsHistory: [
        { action: "Bundle generated in Warehouse WMS", operator: "Admin System" }
      ]
    });

    return NextResponse.json({ success: true, bundle: newBundle });
  } catch (error) {
    console.error("Create bundle error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT: Update bundle status / SKU codes / laundry pipeline
export async function PUT(request) {
  try {
    await dbConnect();
    const admin = await verifyAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { action, bundleId } = body;

    const bundle = await Bundle.findOne({ bundleId });
    if (!bundle) {
      return NextResponse.json({ error: "Bundle not found" }, { status: 404 });
    }

    // Resolve matching category for inventory adjustments
    const category = await Category.findOne({ name: bundle.bedType });

    if (action === "update_skus") {
      const { items } = body;
      bundle.items = items;
      bundle.status = "READY_TO_DISPATCH";
      bundle.logisticsHistory.push({
        action: "Physical items assigned unique SKU barcodes. Package sealed.",
        operator: "Warehouse Supervisor"
      });
      await bundle.save();
      return NextResponse.json({ success: true, bundle });
    }

    if (action === "scan_dispatch") {
      if (bundle.status !== "READY_TO_DISPATCH" && bundle.status !== "CREATED") {
        return NextResponse.json({ error: "Bundle is not ready for dispatch." }, { status: 400 });
      }

      bundle.status = "DISPATCHED";
      bundle.logisticsHistory.push({
        action: "QR stick scanned. Bundle left Warehouse dock A. Handed to Logistics Partner.",
        operator: "Dock Loader"
      });
      await bundle.save();

      // Adjust inventory stocks: decrement available, increment rented
      if (category) {
        category.availableStock = Math.max(0, category.availableStock - 1);
        category.rentedStock = (category.rentedStock || 0) + 1;
        await category.save();
      }

      // Automatically update parent order status to DELIVERED / ACTIVE
      await Order.findByIdAndUpdate(bundle.orderId, { status: "ACTIVE" });

      return NextResponse.json({ success: true, bundle });
    }

    if (action === "scan_return") {
      if (bundle.status !== "DISPATCHED" && bundle.status !== "DELIVERED") {
        // Allow return scan anyway for recovery purposes
      }

      bundle.status = "SENT_TO_LAUNDRY";
      // Mark all items as pending wash
      bundle.items = bundle.items.map(item => ({
        ...item.toObject(),
        laundryStatus: "PENDING_WASH"
      }));
      bundle.logisticsHistory.push({
        action: "QR scan return: Collection package received at dock. Sent to laundry sanitizing center.",
        operator: "Receiving Inspector"
      });
      await bundle.save();

      // Adjust inventory stocks: decrement rented, increment laundry
      if (category) {
        category.rentedStock = Math.max(0, (category.rentedStock || 0) - 1);
        category.laundryStock = (category.laundryStock || 0) + 1;
        await category.save();
      }

      return NextResponse.json({ success: true, bundle });
    }

    if (action === "update_laundry") {
      const { laundryStatus } = body;
      
      // Update all items in the bundle to the new laundry status
      bundle.items = bundle.items.map(item => ({
        ...item.toObject(),
        laundryStatus
      }));

      let statusLogMsg = "";
      if (laundryStatus === "WASHING") {
        statusLogMsg = "Linen loaded in industrial thermic washers (60°C+ sanitation wash).";
      } else if (laundryStatus === "SANITIZING") {
        statusLogMsg = "Linen passed through high-intensity UV-C disinfection deck.";
      } else if (laundryStatus === "STEAM_PRESSING") {
        statusLogMsg = "Sheets steam-ironed at thermodynamic temperatures.";
      } else if (laundryStatus === "VACUUM_PACKING") {
        statusLogMsg = "Pristine sheets sealed in airtight vacuum logistics packs.";
      } else if (laundryStatus === "CLEAN_STOCK") {
        statusLogMsg = "Linen returned to available clean shelves.";
      }

      bundle.logisticsHistory.push({
        action: `Laundry Stage Update: ${statusLogMsg}`,
        operator: "Laundry Specialist"
      });

      if (laundryStatus === "CLEAN_STOCK") {
        bundle.status = "COMPLETED";
        // Adjust inventory stocks: decrement laundry, increment available
        if (category) {
          category.laundryStock = Math.max(0, (category.laundryStock || 0) - 1);
          category.availableStock = (category.availableStock || 0) + 1;
          await category.save();
        }
      } else {
        bundle.status = "IN_LAUNDRY";
      }

      await bundle.save();
      return NextResponse.json({ success: true, bundle });
    }

    return NextResponse.json({ error: "Invalid WMS action" }, { status: 400 });
  } catch (error) {
    console.error("PUT WMS bundle error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE: Delete / Cancel bundle, release back to stock
export async function DELETE(request) {
  try {
    await dbConnect();
    const admin = await verifyAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const bundleId = searchParams.get("bundleId");

    if (!bundleId) {
      return NextResponse.json({ error: "Bundle ID required" }, { status: 400 });
    }

    const bundle = await Bundle.findOne({ bundleId });
    if (!bundle) {
      return NextResponse.json({ error: "Bundle not found" }, { status: 404 });
    }

    // If bundle was dispatched/delivered, release rented inventory
    if (bundle.status === "DISPATCHED" || bundle.status === "DELIVERED") {
      const category = await Category.findOne({ name: bundle.bedType });
      if (category) {
        category.rentedStock = Math.max(0, (category.rentedStock || 0) - 1);
        category.availableStock = (category.availableStock || 0) + 1;
        await category.save();
      }
    } else if (bundle.status === "SENT_TO_LAUNDRY" || bundle.status === "IN_LAUNDRY") {
      const category = await Category.findOne({ name: bundle.bedType });
      if (category) {
        category.laundryStock = Math.max(0, (category.laundryStock || 0) - 1);
        category.availableStock = (category.availableStock || 0) + 1;
        await category.save();
      }
    }

    await Bundle.deleteOne({ bundleId });
    return NextResponse.json({ success: true, message: "Bundle deleted and inventory released." });
  } catch (error) {
    console.error("DELETE bundle error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
