import mongoose from "mongoose";

const DurationDiscountSchema = new mongoose.Schema(
  {
    durationMonths: {
      type: Number,
      required: true,
      unique: true,
    },
    discountPercent: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.DurationDiscount || mongoose.model("DurationDiscount", DurationDiscountSchema);
