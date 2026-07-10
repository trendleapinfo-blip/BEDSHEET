const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const MONGODB_URI = "mongodb://127.0.0.1:27017/close";

// Define Schemas inline to prevent ESM import/Next.js alias errors in Node script
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  mobile: { type: String },
  address: { type: String },
  accountType: { type: String, default: "Individual User" },
  role: { type: String, default: "user" },
  status: { type: String, default: "ACTIVE" }
});

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  pricePerItem: { type: Number, required: true },
  status: { type: String, default: "ACTIVE" },
  totalStock: { type: Number, default: 100 },
  availableStock: { type: Number, default: 100 },
  rentedStock: { type: Number, default: 0 },
  laundryStock: { type: Number, default: 0 }
});

const OrderSchema = new mongoose.Schema({
  bundleOrderId: { type: String, required: true, unique: true },
  userId: { type: String },
  userName: { type: String },
  phone: { type: String },
  email: { type: String },
  bundleName: { type: String, required: true },
  duration: { type: String, default: "—" },
  finalPrice: { type: Number, required: true },
  status: { type: String, default: "PENDING" },
  orderType: { type: String, default: "RENT" },
  deliveryAddress: { type: String },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date }
});

const PlanSchema = new mongoose.Schema({
  bedType: { type: String, required: true },
  size: { type: String, default: null },
  name: { type: String, required: true },
  duration: { type: String, required: true },
  price: { type: Number, required: true },
  features: { type: [String], default: [] },
  cta: { type: String, default: "Choose Plan" },
  popular: { type: Boolean, default: false },
  badge: { type: String, default: null }
});

const CouponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  discountType: { type: String, required: true },
  discountValue: { type: Number, required: true },
  minPurchase: { type: Number, default: 0 },
  maxDiscount: { type: Number, default: null },
  isActive: { type: Boolean, default: true }
});

const BrandSettingsSchema = new mongoose.Schema({
  brandName: { type: String, default: "ClosetRush" },
  installBannerText: { type: String },
  installBannerActive: { type: Boolean, default: true },
  primaryColor: { type: String },
  accentColor: { type: String },
  contactEmail: { type: String },
  singleBedDeposit: { type: Number, default: 500 },
  doubleBedDeposit: { type: Number, default: 800 }
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);
const Category = mongoose.models.Category || mongoose.model("Category", CategorySchema);
const Order = mongoose.models.Order || mongoose.model("Order", OrderSchema);
const Plan = mongoose.models.Plan || mongoose.model("Plan", PlanSchema);
const Coupon = mongoose.models.Coupon || mongoose.model("Coupon", CouponSchema);
const BrandSettings = mongoose.models.BrandSettings || mongoose.model("BrandSettings", BrandSettingsSchema);

async function runSeed() {
  try {
    console.log("Connecting to MongoDB at:", MONGODB_URI);
    await mongoose.connect(MONGODB_URI);
    console.log("Connected successfully!");

    console.log("Cleaning up existing collection tables...");
    await User.deleteMany({});
    await Category.deleteMany({});
    await Order.deleteMany({});
    await Plan.deleteMany({});
    await Coupon.deleteMany({});
    await BrandSettings.deleteMany({});
    if (mongoose.connection.collections["quotes"]) {
      await mongoose.connection.collections["quotes"].deleteMany({});
    }
    if (mongoose.connection.collections["bundles"]) {
      await mongoose.connection.collections["bundles"].deleteMany({});
    }
    console.log("Cleanup complete.");

    // 1. Seed Admin User
    const adminPasswordHash = await bcrypt.hash("adminpassword", 10);
    const seededAdmin = await User.create({
      name: "Prasad Shaswat",
      email: "admin@closetrush.com",
      password: adminPasswordHash,
      mobile: "9999999999",
      address: "HQ, ClosetRush Delhi NCR",
      accountType: "Individual User",
      role: "admin",
      status: "ACTIVE"
    });
    console.log("Seeded admin user: admin@closetrush.com / adminpassword");

    // 2. Seed default categories with available stocks
    await Category.create([
      { name: "Bedsheet + Pillow (Single)", description: "Premium single bed sheets and pillow covers set", pricePerItem: 300, totalStock: 100, availableStock: 100 },
      { name: "Bedsheet + Pillow (Double)", description: "Premium double bed sheets and pillow covers set", pricePerItem: 800, totalStock: 100, availableStock: 100 },
      { name: "Curtains", description: "Sanitized window and door curtains", pricePerItem: 400, totalStock: 100, availableStock: 100 },
      { name: "Quilts", description: "High-loft sanitized warm quilts", pricePerItem: 500, totalStock: 100, availableStock: 100 },
      { name: "Blankets", description: "Thermodynamic hot-washed warm blankets", pricePerItem: 450, totalStock: 100, availableStock: 100 }
    ]);
    console.log("Seeded default linen categories.");

    // 3. Seed plans
    await Plan.create([
      { bedType: "Bedsheet + Pillow (Single)", size: "6x3 ft", name: "Single Bed Plan", duration: "1 Month", price: 300, securityDeposit: 500, features: ["1 Clean Bedsheet", "1 Pillow Cover", "Free Doorstep Delivery"], cta: "Choose Plan" },
      { bedType: "Bedsheet + Pillow (Single)", size: "6x3 ft", name: "Single Bed Plan", duration: "3 Months", price: 855, securityDeposit: 500, features: ["3 Swaps (1 per month)", "1 Pillow Cover"], cta: "Choose Plan" },
      { bedType: "Bedsheet + Pillow (Single)", size: "6x3 ft", name: "Single Bed Plan", duration: "12 Months", price: 3240, securityDeposit: 500, popular: true, badge: "Best Value", features: ["12 Swaps (1 per month)", "1 Pillow Cover"], cta: "Choose Plan" },
      
      { bedType: "Bedsheet + Pillow (Double)", size: "6x5 ft", name: "Double Bed Plan", duration: "1 Month", price: 800, securityDeposit: 800, features: ["2 Clean Bedsheets", "2 Pillow Covers", "Free Doorstep Delivery"], cta: "Choose Plan" },
      { bedType: "Bedsheet + Pillow (Double)", size: "6x5 ft", name: "Double Bed Plan", duration: "3 Months", price: 2280, securityDeposit: 800, features: ["3 Swaps (1 per month)", "2 Pillow Covers"], cta: "Choose Plan" },
      { bedType: "Bedsheet + Pillow (Double)", size: "6x5 ft", name: "Double Bed Plan", duration: "12 Months", price: 8640, securityDeposit: 800, popular: true, badge: "Best Value", features: ["12 Swaps (1 per month)", "2 Pillow Covers"], cta: "Choose Plan" },

      { bedType: "Curtains", size: "Standard", name: "Curtains Plan", duration: "1 Month", price: 400, securityDeposit: 600, features: ["2 Curtains", "Free swaps"], cta: "Choose Plan" },
      { bedType: "Curtains", size: "Standard", name: "Curtains Plan", duration: "3 Months", price: 1140, securityDeposit: 600, features: ["6 Swaps", "Free swaps"], cta: "Choose Plan" },
      { bedType: "Curtains", size: "Standard", name: "Curtains Plan", duration: "12 Months", price: 4320, securityDeposit: 600, popular: true, badge: "Best Value", features: ["24 Swaps", "Free swaps"], cta: "Choose Plan" },

      { bedType: "Quilts", size: "6x5 ft", name: "Warm Quilt Plan", duration: "1 Month", price: 600, securityDeposit: 1000, features: ["1 Sanitized Quilt"], cta: "Choose Plan" },
      { bedType: "Quilts", size: "6x5 ft", name: "Warm Quilt Plan", duration: "3 Months", price: 1710, securityDeposit: 1000, features: ["3 Swaps"], cta: "Choose Plan" },
      { bedType: "Quilts", size: "6x5 ft", name: "Warm Quilt Plan", duration: "12 Months", price: 6480, securityDeposit: 1000, popular: true, badge: "Best Value", features: ["12 Swaps"], cta: "Choose Plan" },

      { bedType: "Blankets", size: "6x5 ft", name: "Blanket Plan", duration: "1 Month", price: 500, securityDeposit: 1000, features: ["1 Warm Blanket"], cta: "Choose Plan" },
      { bedType: "Blankets", size: "6x5 ft", name: "Blanket Plan", duration: "3 Months", price: 1425, securityDeposit: 1000, features: ["3 Swaps"], cta: "Choose Plan" },
      { bedType: "Blankets", size: "6x5 ft", name: "Blanket Plan", duration: "12 Months", price: 5400, securityDeposit: 1000, popular: true, badge: "Best Value", features: ["12 Swaps"], cta: "Choose Plan" }
    ]);
    console.log("Seeded default subscription plans.");

    // 4. Seed Coupon
    await Coupon.create({
      code: "FRESHBED10",
      discountType: "percentage",
      discountValue: 10,
      minPurchase: 500,
      isActive: true
    });
    console.log("Seeded coupon FRESHBED10.");

    // 5. Seed Mock Orders (PENDING WMS)
    await Order.create([
      {
        bundleOrderId: "ORD-83921",
        userId: seededAdmin._id.toString(),
        userName: "Prasad Shaswat",
        phone: "9999999999",
        email: "admin@closetrush.com",
        bundleName: "Bedsheet + Pillow (Double)",
        duration: "1 Month",
        finalPrice: 800,
        status: "PENDING",
        orderType: "RENT",
        deliveryAddress: "HQ, ClosetRush Delhi NCR, Delhi NCR - 394210 | Linen Gold",
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      },
      {
        bundleOrderId: "ORD-12940",
        userId: seededAdmin._id.toString(),
        userName: "Amit Kumar",
        phone: "9876543210",
        email: "amit@example.com",
        bundleName: "Bedsheet + Pillow (Single)",
        duration: "3 Months",
        finalPrice: 855,
        status: "PENDING",
        orderType: "RENT",
        deliveryAddress: "Flat 202, Sector 15, Gurugram - 122001 | Deep Teal",
        startDate: new Date(),
        endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
      }
    ]);
    console.log("Seeded mock customer pending orders.");

    // 6. Seed settings
    await BrandSettings.create({
      brandName: "ClosetRush",
      installBannerText: "Add to home screen for a better experience",
      installBannerActive: true,
      primaryColor: "#0F172A",
      accentColor: "#245c77",
      contactEmail: "support@closetrush.com",
      singleBedDeposit: 500,
      doubleBedDeposit: 800
    });
    console.log("Seeded brand settings.");

    console.log("Database successfully seeded!");
  } catch (err) {
    console.error("Seeding error:", err);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }
}

runSeed();
