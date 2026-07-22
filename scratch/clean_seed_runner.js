const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/close";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  mobile: { type: String },
  address: { type: String },
  accountType: { type: String, default: "Individual User" },
  role: { type: String, default: "user" },
  status: { type: String, default: "ACTIVE" },
  hasPaidDeposit: { type: Boolean, default: false },
  selectedPlan: { type: Object }
}, { timestamps: true });

const OrderSchema = new mongoose.Schema({
  bundleOrderId: { type: String, required: true, unique: true },
  wmsBundleId: { type: String },
  userId: { type: String },
  userName: { type: String },
  phone: { type: String },
  email: { type: String },
  bundleName: { type: String, required: true },
  duration: { type: String },
  durationMonths: { type: Number },
  calculatedRent: { type: Number },
  depositCharged: { type: Number },
  gst: { type: Number },
  depositStatus: { type: String },
  subscriptionStatus: { type: String },
  finalPrice: { type: Number, required: true },
  totalAmount: { type: Number },
  deliveryAddress: { type: String },
  status: { type: String, default: "DELIVERED" },
  dispatchStatus: { type: String, default: "DISPATCHED" },
  dispatchedAt: { type: Date },
  orderType: { type: String, default: "RENT" },
  orderCategory: { type: String, default: "B2C" },
  startDate: { type: Date }
}, { timestamps: true });

const BundleSchema = new mongoose.Schema({
  bundleId: { type: String, required: true, unique: true },
  parentOrderId: { type: String },
  orderId: { type: String, required: true },
  customerName: { type: String, required: true },
  bedType: { type: String, required: true },
  color: { type: String, default: "Pure White Organic Cotton" },
  status: { type: String, default: "DISPATCHED" },
  items: [
    {
      sku: { type: String, required: true },
      itemType: { type: String, required: true },
      laundryStatus: { type: String, default: "CLEAN_STOCK" },
      qrCode: { type: String }
    }
  ]
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model("User", UserSchema);
const Order = mongoose.models.Order || mongoose.model("Order", OrderSchema);
const Bundle = mongoose.models.Bundle || mongoose.model("Bundle", BundleSchema);

async function runCleanSeed() {
  try {
    console.log("Connecting to MongoDB at:", MONGODB_URI);
    await mongoose.connect(MONGODB_URI);

    console.log("Wiping all existing database collections...");
    await User.deleteMany({});
    await Order.deleteMany({});
    await Bundle.deleteMany({});

    console.log("Seeding Admin account...");
    const adminPassword = await bcrypt.hash("adminpassword", 10);
    const admin = await User.create({
      name: "ClosetRush Admin",
      email: "admin@closetrush.com",
      mobile: "9999999999",
      password: adminPassword,
      address: "ClosetRush HQ, Delhi NCR",
      accountType: "Individual User",
      role: "admin",
      status: "ACTIVE"
    });

    console.log("Seeding 4 Customer Accounts and WMS Dispatched Orders...");
    const userPassword = await bcrypt.hash("closetrush123", 10);

    const customerData = [
      {
        sNo: 1,
        name: "Karanbeer Singh",
        email: "karanbeeru801@gmail.com",
        mobile: "9091939129",
        bookingDate: new Date("2026-07-11T00:00:00.000Z"),
        bundleName: "Double Bed Bedsheet",
        duration: "1 Month",
        calculatedRent: 500,
        depositCharged: 800,
        gst: 90,
        finalPrice: 1390,
        deliveryAddress: "The Peepul Stay 2 PG, Sector 69, Gurugram, Haryana – 122101",
        subscriptionStatus: "Pending",
        depositStatus: "Pending",
        bundleOrderId: "CR-2026-0711-KBS",
        wmsBundleId: "WMS-BNDL-2026-KBS-01"
      },
      {
        sNo: 2,
        name: "Shourya Agrawal",
        email: "shourya52003@gmail.com",
        mobile: "9058789666",
        bookingDate: new Date("2026-07-01T00:00:00.000Z"),
        bundleName: "Double Bed Bedsheet",
        duration: "1 Month",
        calculatedRent: 500,
        depositCharged: 800,
        gst: 90,
        finalPrice: 1390,
        deliveryAddress: "Ravinder PG, Sector 69, Gurugram, Haryana – 122101",
        subscriptionStatus: "Pending",
        depositStatus: "Pending",
        bundleOrderId: "CR-2026-0701-SA",
        wmsBundleId: "WMS-BNDL-2026-SA-02"
      },
      {
        sNo: 3,
        name: "Roshan Kumar Yadav",
        email: "roshanyadav44@gmail.com",
        mobile: "9311428047",
        bookingDate: new Date("2026-06-13T00:00:00.000Z"),
        bundleName: "Single Bed Bundle",
        duration: "1 Month",
        calculatedRent: 300,
        depositCharged: 500,
        gst: 54,
        finalPrice: 854,
        deliveryAddress: "Shree Shyam PG, Sohna, Gurugram, Haryana – 122103",
        subscriptionStatus: "Completed",
        depositStatus: "Refund Completed",
        bundleOrderId: "CR-2026-0613-RKY",
        wmsBundleId: "WMS-BNDL-2026-RKY-03"
      },
      {
        sNo: 4,
        name: "Himanshu Kumar Rai",
        email: "himanshukumarrai290@gmail.com",
        mobile: "8081423638",
        bookingDate: new Date("2026-06-13T00:00:00.000Z"),
        bundleName: "Single Bed Bundle",
        duration: "1 Month",
        calculatedRent: 300,
        depositCharged: 500,
        gst: 54,
        finalPrice: 854,
        deliveryAddress: "Our Homes 8, The County by Trisara, Sohna, Haryana – 122103",
        subscriptionStatus: "Completed",
        depositStatus: "Refund Completed",
        bundleOrderId: "CR-2026-0613-HKR",
        wmsBundleId: "WMS-BNDL-2026-HKR-04"
      }
    ];

    for (const d of customerData) {
      const u = await User.create({
        name: d.name,
        email: d.email.toLowerCase(),
        mobile: d.mobile,
        password: userPassword,
        address: d.deliveryAddress,
        accountType: "Individual User",
        role: "user",
        status: "ACTIVE",
        hasPaidDeposit: true,
        selectedPlan: {
          bedType: d.bundleName,
          planName: d.bundleName,
          price: d.calculatedRent,
          duration: d.duration,
          securityDeposit: d.depositCharged,
          gst: d.gst,
          totalPrice: d.finalPrice,
          startDate: d.bookingDate
        }
      });

      const o = await Order.create({
        bundleOrderId: d.bundleOrderId,
        wmsBundleId: d.wmsBundleId,
        userId: u._id.toString(),
        userName: d.name,
        phone: d.mobile,
        email: d.email.toLowerCase(),
        bundleName: d.bundleName,
        duration: d.duration,
        calculatedRent: d.calculatedRent,
        depositCharged: d.depositCharged,
        gst: d.gst,
        depositStatus: d.depositStatus,
        subscriptionStatus: d.subscriptionStatus,
        finalPrice: d.finalPrice,
        totalAmount: d.finalPrice,
        deliveryAddress: d.deliveryAddress,
        status: "DELIVERED",
        dispatchStatus: "DISPATCHED",
        dispatchedAt: d.bookingDate,
        orderType: "RENT",
        orderCategory: "B2C",
        startDate: d.bookingDate
      });

      const b = await Bundle.create({
        bundleId: d.wmsBundleId,
        orderId: d.bundleOrderId,
        parentOrderId: d.bundleOrderId,
        customerName: d.name,
        bedType: d.bundleName,
        color: "Pure White Organic Cotton",
        status: "DISPATCHED",
        items: [
          { sku: `SKU-${d.sNo}-SHT-01`, itemType: "Bedsheet", laundryStatus: "CLEAN_STOCK", qrCode: `QR-SHT-${d.bundleOrderId}-01` },
          { sku: `SKU-${d.sNo}-PLW-01`, itemType: "Pillow Cover", laundryStatus: "CLEAN_STOCK", qrCode: `QR-PLW-${d.bundleOrderId}-01` }
        ]
      });

      console.log(`✅ Seeded: ${d.name} (${d.email}) -> Order: ${d.bundleOrderId} | WMS: ${d.wmsBundleId} [DISPATCHED]`);
    }

    console.log("-------------------------------------------------------");
    console.log("🎉 SUCCESS: Database clean wiped & re-seeded with 1 Admin + 4 Dispatched Customer Orders!");
    console.log("-------------------------------------------------------");

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("❌ Error running clean seed:", err);
    process.exit(1);
  }
}

runCleanSeed();
