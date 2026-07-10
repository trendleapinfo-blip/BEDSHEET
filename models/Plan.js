import mongoose from "mongoose";

const PlanSchema = new mongoose.Schema(
  {
    tier: {
      type: String, // "Normal" | "Premium"
      required: true,
      enum: ["Normal", "Premium"],
    },
    bedType: {
      type: String, // "single" | "double"
      required: true,
      enum: ["single", "double"],
    },
    monthlyRate: {
      type: Number,
      required: true,
    },
    depositAmount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Plan || mongoose.model("Plan", PlanSchema);
