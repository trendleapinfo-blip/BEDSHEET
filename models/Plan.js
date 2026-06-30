import mongoose from "mongoose";

const PlanSchema = new mongoose.Schema(
  {
    bedType: {
      type: String, // 'single' | 'double'
      required: true,
    },
    name: {
      type: String, // 'Starter' | 'Growth' | 'Professional' | 'Enterprise'
      required: true,
    },
    duration: {
      type: String, // '1 Month' | '3 Months' | '6 Months' | '12 Months'
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    originalPrice: {
      type: Number,
      default: null,
    },
    discount: {
      type: String,
      default: null,
    },
    features: {
      type: [String],
      default: [],
    },
    cta: {
      type: String,
      default: "Choose Plan",
    },
    popular: {
      type: Boolean,
      default: false,
    },
    badge: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Plan || mongoose.model("Plan", PlanSchema);
