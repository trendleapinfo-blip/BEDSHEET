import mongoose from "mongoose";

const WaitlistSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "CONTACTED", "CONVERTED", "CANCELLED"],
      default: "PENDING",
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Waitlist || mongoose.model("Waitlist", WaitlistSchema);
