import mongoose from "mongoose";

const OtpSchema = new mongoose.Schema(
  {
    emailOrMobile: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    code: {
      type: String,
      required: true,
      trim: true,
    },
    purpose: {
      type: String,
      required: true,
      enum: ["login", "signup", "reset_password"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 300, // Expires after 5 minutes (TTL index)
    },
  },
  { timestamps: true }
);

// Ensure compilation matches across Next.js API reloads
export default mongoose.models.Otp || mongoose.model("Otp", OtpSchema);
