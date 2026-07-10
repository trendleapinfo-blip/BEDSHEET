import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Category from "@/models/Category";
import { verifyAdmin } from "@/lib/adminAuth";

export async function GET() {
  try {
    const admin = await verifyAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Forbidden. Admin access required." }, { status: 403 });
    }

    await dbConnect();
    const categories = await Category.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ categories });
  } catch (error) {
    console.error("Fetch Categories Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const admin = await verifyAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Forbidden. Admin access required." }, { status: 403 });
    }

    await dbConnect();
    const { name, description, pricePerItem, status, totalStock, availableStock, rentedStock, laundryStock } = await request.json();

    if (!name || pricePerItem === undefined) {
      return NextResponse.json({ error: "Name and Price per item are required" }, { status: 400 });
    }

    const newCategory = await Category.create({
      name,
      description,
      pricePerItem,
      status: status || "ACTIVE",
      totalStock: totalStock !== undefined ? Number(totalStock) : 100,
      availableStock: availableStock !== undefined ? Number(availableStock) : 100,
      rentedStock: rentedStock !== undefined ? Number(rentedStock) : 0,
      laundryStock: laundryStock !== undefined ? Number(laundryStock) : 0,
    });

    return NextResponse.json({ success: true, category: newCategory });
  } catch (error) {
    console.error("Create Category Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const admin = await verifyAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Forbidden. Admin access required." }, { status: 403 });
    }

    await dbConnect();
    const { categoryId, name, description, pricePerItem, status, totalStock, availableStock, rentedStock, laundryStock } = await request.json();

    if (!categoryId) {
      return NextResponse.json({ error: "Category ID is required" }, { status: 400 });
    }

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (pricePerItem !== undefined) updateData.pricePerItem = pricePerItem;
    if (status !== undefined) updateData.status = status;
    if (totalStock !== undefined) updateData.totalStock = Number(totalStock);
    if (availableStock !== undefined) updateData.availableStock = Number(availableStock);
    if (rentedStock !== undefined) updateData.rentedStock = Number(rentedStock);
    if (laundryStock !== undefined) updateData.laundryStock = Number(laundryStock);

    const updated = await Category.findByIdAndUpdate(
      categoryId,
      updateData,
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, category: updated });
  } catch (error) {
    console.error("Update Category Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const admin = await verifyAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Forbidden. Admin access required." }, { status: 403 });
    }

    await dbConnect();
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("categoryId");

    if (!categoryId) {
      return NextResponse.json({ error: "Category ID is required" }, { status: 400 });
    }

    const deleted = await Category.findByIdAndDelete(categoryId);
    if (!deleted) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Category deleted successfully" });
  } catch (error) {
    console.error("Delete Category Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
