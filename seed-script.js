const mongoose = require("mongoose");

const MONGO_URI = "mongodb://127.0.0.1:27017/close";

const PlanSchema = new mongoose.Schema({
  tier: { type: String, required: true, enum: ["Normal", "Premium"] },
  bedType: { type: String, required: true, enum: ["single", "double"] },
  monthlyRate: { type: Number, required: true },
  depositAmount: { type: Number, required: true },
}, { timestamps: true });

const DurationDiscountSchema = new mongoose.Schema({
  durationMonths: { type: Number, required: true, unique: true },
  discountPercent: { type: Number, required: true },
}, { timestamps: true });

const Plan = mongoose.models.Plan || mongoose.model("Plan", PlanSchema);
const DurationDiscount = mongoose.models.DurationDiscount || mongoose.model("DurationDiscount", DurationDiscountSchema);

async function seed() {
  try {
    console.log("Connecting to MongoDB...", MONGO_URI);
    await mongoose.connect(MONGO_URI);
    console.log("Connected.");

    console.log("Clearing existing plans...");
    await Plan.deleteMany({});
    
    console.log("Inserting new plans...");
    const plans = [
      { tier: "Normal", bedType: "single", monthlyRate: 300, depositAmount: 500 },
      { tier: "Normal", bedType: "double", monthlyRate: 800, depositAmount: 800 },
      { tier: "Premium", bedType: "single", monthlyRate: 750, depositAmount: 0 },
      { tier: "Premium", bedType: "double", monthlyRate: 950, depositAmount: 0 },
    ];
    await Plan.insertMany(plans);
    console.log("Plans inserted.");

    console.log("Clearing existing duration discounts...");
    await DurationDiscount.deleteMany({});
    
    console.log("Inserting new duration discounts...");
    const discounts = [
      { durationMonths: 1, discountPercent: 0 },
      { durationMonths: 3, discountPercent: 5 },
      { durationMonths: 6, discountPercent: 10 },
      { durationMonths: 9, discountPercent: 10 },
      { durationMonths: 12, discountPercent: 20 },
    ];
    await DurationDiscount.insertMany(discounts);
    console.log("Duration discounts inserted.");

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Seeding Error:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected.");
  }
}

seed();
