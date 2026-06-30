import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      trim: true,
    },
    pricePerItem: {
      type: Number,
      required: [true, "Price per item is required"],
    },
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
    },
    totalStock: {
      type: Number,
      default: 100,
    },
    availableStock: {
      type: Number,
      default: 100,
    },
    rentedStock: {
      type: Number,
      default: 0,
    },
    laundryStock: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Category || mongoose.model("Category", CategorySchema);
