import mongoose from "mongoose";

const ProductColorSchema = new mongoose.Schema(
  {
    bedType: {
      type: String, // e.g. 'Bedsheet + Pillow (Single)', 'Blankets'
      required: true,
    },
    colorName: {
      type: String, // e.g. 'Classic White', 'Slate Gray'
      required: true,
    },
    hexCode: {
      type: String, // e.g. '#FFFFFF', '#64748B'
      required: true,
    },
    images: {
      type: [String], // Array of 2-3 image URLs
      default: [],
    }
  },
  { timestamps: true }
);

export default mongoose.models.ProductColor || mongoose.model("ProductColor", ProductColorSchema);
