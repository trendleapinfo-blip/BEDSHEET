import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Quote from "@/models/Quote";

export async function POST(request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret");
    } catch (err) {
      return NextResponse.json({ error: "Invalid session token." }, { status: 401 });
    }

    const {
      businessName,
      businessType,
      propertiesCount,
      unitsCount,
      bundleSelections,
      message,
      estimatedTotal,
    } = await request.json();

    if (!businessName) {
      return NextResponse.json({ error: "Business name is required." }, { status: 400 });
    }

    await dbConnect();

    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const newQuote = await Quote.create({
      type: "quotation",
      businessName,
      contactPerson: user.name,
      email: user.email,
      phone: user.mobile || "—",
      businessType: businessType || "PG",
      message: message || "—",
      propertiesCount: Number(propertiesCount) || 1,
      unitsCount: Number(unitsCount) || 1,
      bundleSelections: bundleSelections || "No bundles",
      estimatedTotal: Number(estimatedTotal) || 0,
      status: "PENDING",
    });

    return NextResponse.json({
      success: true,
      message: "Quotation request submitted successfully.",
      quote: newQuote,
    });
  } catch (error) {
    console.error("Create Quote API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error occurred while submitting quote request." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret");
    } catch (err) {
      return NextResponse.json({ error: "Invalid session token." }, { status: 401 });
    }

    await dbConnect();

    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const quotes = await Quote.find({ email: user.email }).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      quotes,
    });
  } catch (error) {
    console.error("Get Quotes API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error occurred while fetching quote requests." },
      { status: 500 }
    );
  }
}
