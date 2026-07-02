import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    bundleOrderId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    userId: {
      type: String,
      trim: true,
    },
    userName: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
    },
    bundleName: {
      type: String,
      required: true,
      trim: true,
    },
    duration: {
      type: String,
      default: "—",
    },
    finalPrice: {
      type: Number,
      required: true,
    },
    couponCode: {
      type: String,
      default: null,
      trim: true,
    },
    discount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["ACTIVE", "CANCELLED", "PENDING", "DELIVERED"],
      default: "ACTIVE",
    },
    orderType: {
      type: String,
      enum: ["RENT", "BUY"],
      default: "RENT",
    },
    itemTier: {
      type: String,
      enum: ["BASIC", "PREMIUM"],
      default: "BASIC",
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
    },
    deliveryAddress: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
