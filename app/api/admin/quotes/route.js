import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Quote from "@/models/Quote";

export async function GET() {
  try {
    await dbConnect();
    const quotes = await Quote.find({}).sort({ receivedAt: -1 });
    return NextResponse.json({ quotes });
  } catch (error) {
    console.error("Fetch Quotes Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const newQuote = await Quote.create(body);
    return NextResponse.json({ success: true, quote: newQuote });
  } catch (error) {
    console.error("Create Quote Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    await dbConnect();
    const { quoteId, status } = await request.json();

    if (!quoteId || !status) {
      return NextResponse.json({ error: "Quote ID and Status are required" }, { status: 400 });
    }

    const updated = await Quote.findByIdAndUpdate(quoteId, { status }, { new: true });
    if (!updated) {
      return NextResponse.json({ error: "Quote not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, quote: updated });
  } catch (error) {
    console.error("Update Quote Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const quoteId = searchParams.get("quoteId");

    if (!quoteId) {
      return NextResponse.json({ error: "Quote ID is required" }, { status: 400 });
    }

    const deleted = await Quote.findByIdAndDelete(quoteId);
    if (!deleted) {
      return NextResponse.json({ error: "Quote not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Quote deleted successfully" });
  } catch (error) {
    console.error("Delete Quote Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
