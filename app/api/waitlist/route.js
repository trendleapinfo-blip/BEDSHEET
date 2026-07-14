import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Waitlist from "@/models/Waitlist";

export async function POST(request) {
  try {
    await dbConnect();
    const { email, phone } = await request.json();

    if (!email || !phone) {
      return NextResponse.json(
        { error: "Email and Phone number are required." },
        { status: 400 }
      );
    }

    // Check if email already on waitlist
    const existing = await Waitlist.findOne({ email: email.toLowerCase() });
    if (existing) {
      return NextResponse.json(
        { error: "You are already on the priority waitlist!" },
        { status: 400 }
      );
    }

    const waitlistEntry = await Waitlist.create({
      email: email.toLowerCase(),
      phone,
    });

    return NextResponse.json({ success: true, entry: waitlistEntry });
  } catch (error) {
    console.error("Waitlist Submission Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
