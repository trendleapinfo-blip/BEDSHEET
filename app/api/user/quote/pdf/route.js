import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Quote from "@/models/Quote";
import Order from "@/models/Order";

// Function to generate a basic valid A4 PDF natively
function generateNativePDF(title, invoiceNo, date, clientName, contactPerson, mobile, email, address, items, totalVal, signature = "") {
  let textStream = "BT\n/F1 12 Tf\n15 Lh\n50 780 Td\n";
  
  // Header
  textStream += `(${title.toUpperCase()}) Tj\n`;
  textStream += `0 -25 Td\n(DOCUMENT ID: ${invoiceNo}) Tj\n`;
  textStream += `0 -18 Td\n(DATE: ${date}) Tj\n`;
  textStream += `0 -18 Td\n(CLIENT: ${clientName} (${contactPerson})) Tj\n`;
  textStream += `0 -18 Td\n(CONTACT PHONE: ${mobile}) Tj\n`;
  textStream += `0 -18 Td\n(CONTACT EMAIL: ${email}) Tj\n`;
  textStream += `0 -18 Td\n(ADDRESS: ${address.substring(0, 70)}) Tj\n`;
  if (address.length > 70) {
    textStream += `0 -15 Td\n(         ${address.substring(70, 140)}) Tj\n`;
  }
  textStream += `0 -25 Td\n(============================================================) Tj\n`;
  
  // Items List
  textStream += `0 -20 Td\n/F1 10 Tf\n(ITEM DESCRIPTIONS & TARIFF DETAILS:) Tj\n`;
  items.forEach((item) => {
    textStream += `0 -18 Td\n(${item.name.substring(0, 50)}  x ${item.qty}  --  Rs.${item.total}) Tj\n`;
    if (item.name.length > 50) {
      textStream += `0 -12 Td\n(   ${item.name.substring(50, 100)}) Tj\n`;
    }
  });
  textStream += `0 -25 Td\n(============================================================) Tj\n`;
  
  // Total
  textStream += `0 -20 Td\n/F1 12 Tf\n(GRAND TOTAL PAYABLE: Rs.${totalVal}) Tj\n`;
  textStream += `0 -25 Td\n(============================================================) Tj\n`;
  
  // E-Signature
  if (signature) {
    textStream += `0 -20 Td\n/F1 10 Tf\n(E-SIGNED APPROVAL: ${signature}) Tj\n`;
    textStream += `0 -15 Td\n(STATUS: CONTRACT EXECUTED & APPROVED) Tj\n`;
  } else {
    textStream += `0 -20 Td\n/F1 10 Tf\n(STATUS: AWAITING E-SIGN APPROVAL) Tj\n`;
  }
  
  // Footer
  textStream += `0 -50 Td\n/F1 8 Tf\n(ClosetRush Bedding Rentals | Thermodynamic UV-C Sterilized Sheets & Linens) Tj\n`;
  textStream += `0 -12 Td\n(Corporate Office: Delhi NCR, India | Support: support@closetrush.com) Tj\n`;
  textStream += "ET";

  const streamContent = textStream;
  const streamLength = Buffer.byteLength(streamContent);

  const pdfObjects = [
    `%PDF-1.4\n`,
    `1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n`,
    `2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n`,
    `3 0 obj\n<< /Type /Page /Parent 2 0 R /Resources << /Font << /F1 5 0 R >> >> /MediaBox [0 0 595.275 841.89] /Contents 4 0 R >>\nendobj\n`,
    `4 0 obj\n<< /Length ${streamLength} >>\nstream\n${streamContent}\nendstream\nendobj\n`,
    `5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n`
  ];

  const pdfString = pdfObjects.join("");
  const xrefOffset = pdfString.length;
  const trailer = `\nxref\n0 6\n0000000000 65535 f\n0000000009 00000 n\n0000000058 00000 n\n0000000115 00000 n\n0000000250 00000 n\n0000000300 00000 n\ntrailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;

  return Buffer.from(pdfString + trailer, 'binary');
}

export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const quoteId = searchParams.get("quoteId");
    const orderId = searchParams.get("orderId");

    if (!quoteId && !orderId) {
      return NextResponse.json({ error: "Missing quoteId or orderId parameter." }, { status: 400 });
    }

    let pdfBuffer;
    let filename = "document.pdf";

    if (quoteId) {
      const quote = await Quote.findById(quoteId);
      if (!quote) {
        return NextResponse.json({ error: "Quotation request not found." }, { status: 404 });
      }

      const items = [
        {
          name: `${quote.bedType} Bedsheet setup for ${quote.bedsCount} beds (${quote.roomsCount} rooms). Requirements: ${quote.bedsheetRequirements.join(", ")}`,
          qty: quote.bedsCount,
          price: quote.priceQuote ? Math.round(quote.priceQuote / quote.bedsCount) : 250,
          total: quote.priceQuote || (quote.bedsCount * 250)
        }
      ];

      filename = `Quotation_${quote._id}.pdf`;
      pdfBuffer = generateNativePDF(
        "Commercial Quotation Proposal",
        quote._id.toString().substring(0, 8).toUpperCase(),
        new Date(quote.receivedAt || Date.now()).toLocaleDateString(),
        quote.businessName,
        quote.contactPerson,
        quote.phone,
        quote.email,
        quote.propertyAddress || "—",
        items,
        quote.priceQuote || (quote.bedsCount * 250),
        quote.signedBy ? `${quote.signedBy} (${new Date(quote.signedAt).toLocaleDateString()})` : ""
      );
    } else {
      const order = await Order.findOne({ bundleOrderId: orderId });
      if (!order) {
        return NextResponse.json({ error: "Order not found." }, { status: 404 });
      }

      const items = [
        {
          name: `${order.bundleName} (${order.duration} cycle)`,
          qty: 1,
          price: order.finalPrice,
          total: order.finalPrice
        }
      ];

      if (order.discount > 0) {
        items.push({
          name: `Coupon Discount Applied (${order.couponCode || "PROMO"})`,
          qty: 1,
          price: -order.discount,
          total: -order.discount
        });
      }

      filename = `Invoice_${order.bundleOrderId}.pdf`;
      pdfBuffer = generateNativePDF(
        "Subscription Invoice",
        order.bundleOrderId,
        new Date(order.startDate || Date.now()).toLocaleDateString(),
        order.userName,
        order.userName,
        order.phone || "—",
        order.email,
        order.deliveryAddress || "—",
        items,
        order.finalPrice,
        "ClosetRush Dispatch Autopay"
      );
    }

    return new Response(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`
      }
    });
  } catch (error) {
    console.error("PDF generation api error:", error);
    return NextResponse.json({ error: "Internal server error generating PDF." }, { status: 500 });
  }
}
