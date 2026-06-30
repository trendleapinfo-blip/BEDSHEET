import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Plan from "@/models/Plan";

export async function GET() {
  try {
    await dbConnect();
    const plans = await Plan.find({}).lean();
    return NextResponse.json({ success: true, plans }, {
      headers: {
        "Cache-Control": "no-store, max-age=0"
      }
    });
  } catch (error) {
    console.error("Fetch plans error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
