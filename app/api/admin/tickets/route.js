import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import SupportTicket from "@/models/SupportTicket";

export async function GET() {
  try {
    await dbConnect();
    const tickets = await SupportTicket.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ tickets });
  } catch (error) {
    console.error("Fetch Tickets Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const { ticketId, subject, userName, userEmail, priority, status } = await request.json();

    if (!ticketId || !subject || !userName || !userEmail) {
      return NextResponse.json({ error: "Required fields missing" }, { status: 400 });
    }

    const newTicket = await SupportTicket.create({
      ticketId,
      subject,
      userName,
      userEmail,
      priority: priority || "MEDIUM",
      status: status || "OPEN",
    });

    return NextResponse.json({ success: true, ticket: newTicket });
  } catch (error) {
    console.error("Create Ticket Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    await dbConnect();
    const { ticketId, status, priority } = await request.json();

    if (!ticketId) {
      return NextResponse.json({ error: "Ticket ID (database _id) is required" }, { status: 400 });
    }

    const updateData = {};
    if (status) updateData.status = status;
    if (priority) updateData.priority = priority;

    const updated = await SupportTicket.findByIdAndUpdate(ticketId, updateData, { new: true });
    if (!updated) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, ticket: updated });
  } catch (error) {
    console.error("Update Ticket Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const ticketId = searchParams.get("ticketId");

    if (!ticketId) {
      return NextResponse.json({ error: "Ticket ID is required" }, { status: 400 });
    }

    const deleted = await SupportTicket.findByIdAndDelete(ticketId);
    if (!deleted) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Ticket deleted successfully" });
  } catch (error) {
    console.error("Delete Ticket Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
