import mongoose from "mongoose";

const AnalyticsSchema = new mongoose.Schema(
  {
    path: { type: String, required: true },
    userAgent: { type: String, default: "Unknown" },
    referrer: { type: String, default: "Direct" },
    isPwaInstall: { type: Boolean, default: false },
    sessionId: { type: String, default: "" }, // useful to track unique visitors
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Prevent model overwrite in development
export default mongoose.models.Analytics || mongoose.model("Analytics", AnalyticsSchema);
