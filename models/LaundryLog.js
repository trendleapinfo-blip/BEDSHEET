import mongoose from "mongoose";

const LaundryLogSchema = new mongoose.Schema(
  {
    bundleId: {
      type: String,
      required: true,
      trim: true,
    },
    batchId: {
      type: String,
      unique: true,
      required: true,
    },
    itemsSent: [
      {
        sku: { type: String, required: true },
        itemType: { type: String },
        qrCode: { type: String },
      },
    ],
    itemsReceived: [
      {
        sku: { type: String, required: true },
        itemType: { type: String },
        qrCode: { type: String },
      },
    ],
    sentAt: {
      type: Date,
      default: Date.now,
    },
    receivedAt: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["SENT", "PARTIAL_RECEIVED", "FULLY_RECEIVED"],
      default: "SENT",
    },
  },
  { timestamps: true }
);

export default mongoose.models.LaundryLog || mongoose.model("LaundryLog", LaundryLogSchema);
