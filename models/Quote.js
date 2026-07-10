import mongoose from "mongoose";

const QuoteSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["connection", "quotation"],
      required: true,
    },
    businessName: {
      type: String,
      required: true,
      trim: true,
    },
    ownerName: {
      type: String,
      trim: true,
    },
    propertyName: {
      type: String,
      trim: true,
    },
    gstNumber: {
      type: String,
      trim: true,
      default: "",
    },
    propertyAddress: {
      type: String,
      trim: true,
    },
    roomsCount: {
      type: Number,
      default: 0,
    },
    bedsCount: {
      type: Number,
      default: 0,
    },
    bedType: {
      type: String,
      trim: true,
    },
    bedsheetRequirements: {
      type: [String],
      default: [],
    },
    priceQuote: {
      type: Number,
      default: 0,
    },
    contactPerson: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    businessType: {
      type: String,
      trim: true,
    },
    message: {
      type: String,
      trim: true,
    },
    propertiesCount: {
      type: Number,
    },
    unitsCount: {
      type: Number,
    },
    bundleSelections: {
      type: String,
      trim: true,
    },
    estimatedTotal: {
      type: Number,
    },
    finalPrice: {
      type: Number,
    },
    durationMonths: {
      type: Number,
    },
    status: {
      type: String,
      enum: ["PENDING", "CONTACTED", "ACCEPTED", "NEGOTIATING", "QUOTE SENT", "PAID", "CONFIRMED", "CANCELLED"],
      default: "PENDING",
    },
    signatureData: {
      type: String,
      default: "",
    },
    signedAt: {
      type: Date,
    },
    signedBy: {
      type: String,
      trim: true,
    },
    receivedAt: {
      type: Date,
      default: Date.now,
    },
    agreementSentAt: {
      type: Date,
    },
    vendorEmail: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Quote || mongoose.model("Quote", QuoteSchema);
