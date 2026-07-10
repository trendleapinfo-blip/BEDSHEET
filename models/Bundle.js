import mongoose from "mongoose";

const BundleSchema = new mongoose.Schema(
  {
    bundleId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    parentOrderId: {
      type: String,
      trim: true,
    },
    orderId: {
      type: String,
      required: true,
      trim: true,
    },
    customerName: {
      type: String,
      required: true,
      trim: true,
    },
    bedType: {
      type: String,
      required: true,
      trim: true,
    },
    color: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["CREATED", "READY_TO_DISPATCH", "DISPATCHED", "DELIVERED", "COLLECTED", "SENT_TO_LAUNDRY", "IN_LAUNDRY", "COMPLETED"],
      default: "CREATED",
    },
    items: [
      {
        sku: { type: String, required: true },
        itemType: { type: String, required: true }, // e.g., Bedsheet, Pillow Cover, Curtain, Blanket, Quilt
        laundryStatus: {
          type: String,
          enum: ["CLEAN_STOCK", "PENDING_WASH", "WASHING", "SANITIZING", "STEAM_PRESSING", "VACUUM_PACKING"],
          default: "CLEAN_STOCK",
        },
        qrCode: { type: String, trim: true },
      },
    ],
    returnedItems: [
      {
        sku: { type: String },
        qrCode: { type: String },
        itemType: { type: String },
        returnedAt: { type: Date, default: Date.now },
        condition: { type: String, enum: ["GOOD", "DAMAGED", "LOST"], default: "GOOD" },
      }
    ],
    logisticsHistory: [
      {
        timestamp: { type: Date, default: Date.now },
        action: { type: String, required: true },
        operator: { type: String, default: "System" },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.Bundle || mongoose.model("Bundle", BundleSchema);
