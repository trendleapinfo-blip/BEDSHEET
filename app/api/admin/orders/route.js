import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Order from "@/models/Order";

export async function GET() {
  try {
    await dbConnect();
    const orders = await Order.find({}).sort({ startDate: -1 });
    return NextResponse.json({ orders });
  } catch (error) {
    console.error("Fetch Orders Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const { bundleOrderId, userId, userName, phone, email, bundleName, duration, finalPrice, status, startDate, endDate, deliveryAddress } = await request.json();

    if (!bundleOrderId || !bundleName || finalPrice === undefined) {
      return NextResponse.json({ error: "Required fields missing" }, { status: 400 });
    }

    const newOrder = await Order.create({
      bundleOrderId,
      userId,
      userName,
      phone,
      email,
      bundleName,
      duration,
      finalPrice,
      status: status || "ACTIVE",
      startDate: startDate || new Date(),
      endDate,
      deliveryAddress,
    });

    return NextResponse.json({ success: true, order: newOrder });
  } catch (error) {
    console.error("Create Order Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    await dbConnect();
    const { orderId, status, deliveryAddress, userName, phone, email, bundleName, finalPrice, startDate, endDate } = await request.json();

    if (!orderId) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
    }

    const updateData = {};
    if (status) updateData.status = status;
    if (deliveryAddress !== undefined) updateData.deliveryAddress = deliveryAddress;
    if (userName !== undefined) updateData.userName = userName;
    if (phone !== undefined) updateData.phone = phone;
    if (email !== undefined) updateData.email = email;
    if (bundleName !== undefined) updateData.bundleName = bundleName;
    if (finalPrice !== undefined) updateData.finalPrice = finalPrice;
    if (startDate !== undefined) updateData.startDate = startDate;
    if (endDate !== undefined) updateData.endDate = endDate;

    const updated = await Order.findByIdAndUpdate(orderId, updateData, { new: true });
    if (!updated) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, order: updated });
  } catch (error) {
    console.error("Update Order Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get("orderId");

    if (!orderId) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
    }

    const deleted = await Order.findByIdAndDelete(orderId);
    if (!deleted) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Order deleted successfully" });
  } catch (error) {
    console.error("Delete Order Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
