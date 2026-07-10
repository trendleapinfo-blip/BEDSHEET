const mongoose = require("mongoose");
const MONGODB_URI = "mongodb://127.0.0.1:27017/close";

// Define a simple Schema inline to avoid Next.js alias imports issues
const PlanSchema = new mongoose.Schema(
  {
    bedType: { type: String, required: true },
    size: { type: String, default: null },
    name: { type: String, required: true },
    duration: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number, default: null },
    discount: { type: String, default: null },
    features: { type: [String], default: [] },
    cta: { type: String, default: "Choose Plan" },
    popular: { type: Boolean, default: false },
    badge: { type: String, default: null },
  },
  { timestamps: true }
);

const Plan = mongoose.models.Plan || mongoose.model("Plan", PlanSchema);

async function seed() {
  try {
    console.log("Connecting to MongoDB at:", MONGODB_URI);
    await mongoose.connect(MONGODB_URI);
    console.log("Connected successfully!");

    console.log("Cleaning up existing plans...");
    await Plan.deleteMany({});
    console.log("Cleaned!");

    console.log("Seeding plans for all 5 categories (3 plans each)...");
    const plans = await Plan.create([
      // Single beds
      { bedType: "Bedsheet + Pillow (Single)", size: "6x3 ft", name: "Single Bed Plan", duration: "1 Month", price: 300, features: ["1 Clean Bedsheet", "1 Pillow Cover", "Free Doorstep Delivery"], cta: "Choose Plan" },
      { bedType: "Bedsheet + Pillow (Single)", size: "6x3 ft", name: "Single Bed Plan", duration: "3 Months", price: 855, discount: "5% off", features: ["3 Swaps (1 per month)", "1 Pillow Cover", "Free Doorstep swaps"], cta: "Choose Plan" },
      { bedType: "Bedsheet + Pillow (Single)", size: "6x3 ft", name: "Single Bed Plan", duration: "12 Months", price: 3240, discount: "10% off", popular: true, badge: "Best Value", features: ["12 Swaps (1 per month)", "1 Pillow Cover", "Premium Sateen Cotton", "Priority logistics"], cta: "Choose Plan" },
      
      // Double beds
      { bedType: "Bedsheet + Pillow (Double)", size: "6x5 ft", name: "Double Bed Plan", duration: "1 Month", price: 800, features: ["2 Clean Bedsheets", "2 Pillow Covers", "Free Doorstep Delivery"], cta: "Choose Plan" },
      { bedType: "Bedsheet + Pillow (Double)", size: "6x5 ft", name: "Double Bed Plan", duration: "3 Months", price: 2280, discount: "5% off", features: ["3 Swaps (1 per month)", "2 Pillow Covers", "Free Doorstep Swaps"], cta: "Choose Plan" },
      { bedType: "Bedsheet + Pillow (Double)", size: "6x5 ft", name: "Double Bed Plan", duration: "12 Months", price: 8640, discount: "10% off", popular: true, badge: "Best Value", features: ["12 Swaps (1 per month)", "2 Pillow Covers", "Premium Sateen Cotton", "Priority logistics"], cta: "Choose Plan" },

      // Curtains
      { bedType: "Curtains", size: "Standard", name: "Linen Curtains Plan", duration: "1 Month", price: 400, features: ["2 Premium Curtains", "Sanitization wash", "Free Doorstep swaps"], cta: "Choose Plan" },
      { bedType: "Curtains", size: "Standard", name: "Linen Curtains Plan", duration: "3 Months", price: 1140, discount: "5% off", features: ["6 Swaps (2 per month)", "Thermal disinfection", "Free Doorstep swaps"], cta: "Choose Plan" },
      { bedType: "Curtains", size: "Standard", name: "Linen Curtains Plan", duration: "12 Months", price: 4320, discount: "10% off", popular: true, badge: "Popular", features: ["24 Swaps (2 per month)", "Dust barrier seal", "Priority logistics"], cta: "Choose Plan" },

      // Quilts
      { bedType: "Quilts", size: "6x5 ft", name: "Warm Quilt Plan", duration: "1 Month", price: 600, features: ["1 Hypoallergenic Quilt", "High-loft microfibers", "Free Doorstep swaps"], cta: "Choose Plan" },
      { bedType: "Quilts", size: "6x5 ft", name: "Warm Quilt Plan", duration: "3 Months", price: 1710, discount: "5% off", features: ["3 Swaps (1 per month)", "Thermal sterilization", "Free Doorstep swaps"], cta: "Choose Plan" },
      { bedType: "Quilts", size: "6x5 ft", name: "Warm Quilt Plan", duration: "12 Months", price: 6480, discount: "10% off", popular: true, badge: "Best Value", features: ["12 Swaps (1 per month)", "Airtight vacuum seal pack", "Priority logistics"], cta: "Choose Plan" },

      // Blankets
      { bedType: "Blankets", size: "6x5 ft", name: "Premium Blanket Plan", duration: "1 Month", price: 500, features: ["1 Thermoregulatory Blanket", "UV-C sanitized finish", "Free Doorstep swaps"], cta: "Choose Plan" },
      { bedType: "Blankets", size: "6x5 ft", name: "Premium Blanket Plan", duration: "3 Months", price: 1425, discount: "5% off", features: ["3 Swaps (1 per month)", "Thermal sterilization", "Free Doorstep swaps"], cta: "Choose Plan" },
      { bedType: "Blankets", size: "6x5 ft", name: "Premium Blanket Plan", duration: "12 Months", price: 5400, discount: "10% off", popular: true, badge: "Best Value", features: ["12 Swaps (1 per month)", "Airtight vacuum seal pack", "Priority logistics"], cta: "Choose Plan" },
    ]);

    console.log(`Seeding successful! Seeded ${plans.length} plans.`);
  } catch (err) {
    console.error("Seeding failed:", err);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }
}

seed();
