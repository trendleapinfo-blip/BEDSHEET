import mongoose from "mongoose";

const BrandSettingsSchema = new mongoose.Schema(
  {
    brandName: {
      type: String,
      default: "ClosetRush",
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
  },
  { timestamps: true }
);

export default mongoose.models.BrandSettings || mongoose.model("BrandSettings", BrandSettingsSchema);
