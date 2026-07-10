import mongoose from "mongoose";

const BrandSettingsSchema = new mongoose.Schema(
  {
    brandName: {
      type: String,
      default: "ClosetRush",
    },
    heroImage: {
      type: String,
      default: "/banner_1.png",
    },
    installBannerText: {
      type: String,
      default: "Add to home screen for a better experience",
    },
    installBannerActive: {
      type: Boolean,
      default: true,
    },
    primaryColor: {
      type: String,
      default: "#0F172A",
    },
    accentColor: {
      type: String,
      default: "#245c77",
    },
    contactEmail: {
      type: String,
      default: "support@closetrush.com",
    },
    singleBedDeposit: {
      type: Number,
      default: 500,
    },
    doubleBedDeposit: {
      type: Number,
      default: 800,
    },
    paymentStyles: {
      type: [{
        id: { type: String, required: true },
        name: { type: String, required: true },
        description: { type: String, required: true },
        depositMultiplier: { type: Number, default: 1 },
        commissionRate: { type: Number, default: 0 }
      }],
      default: [
        { id: "Monthly", name: "Standard Monthly", description: "Requires refundable security deposit of ₹{deposit}", depositMultiplier: 1, commissionRate: 10 },
        { id: "Advance", name: "Advance Plan", description: "Pay full subscription upfront. Zero security deposit required.", depositMultiplier: 0, commissionRate: 0 }
      ]
    },
    availableColors: {
      type: [{
        name: { type: String, required: true },
        hex: { type: String, required: true }
      }],
      default: [
        { name: "Classic White", hex: "#FFFFFF" },
        { name: "Deep Teal", hex: "#245c77" },
        { name: "Linen Gold", hex: "#A89276" },
        { name: "Slate Gray", hex: "#64748B" },
        { name: "Lavender Mist", hex: "#E9E3FF" }
      ]
    }
  },
  { timestamps: true }
);

export default mongoose.models.BrandSettings || mongoose.model("BrandSettings", BrandSettingsSchema);
