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
    status: {
      type: String,
      enum: ["PENDING", "CONTACTED", "ACCEPTED", "NEGOTIATING", "QUOTE SENT"],
      default: "PENDING",
    },
    receivedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Quote || mongoose.model("Quote", QuoteSchema);
