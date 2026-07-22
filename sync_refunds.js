import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/closetrush";

async function syncRefunds() {
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB.");

  const User = mongoose.connection.collection("users");
  const Order = mongoose.connection.collection("orders");
  const Refund = mongoose.connection.collection("refunds");

  const now = new Date();

  // 1. Sync expired/cancelled Orders with a security deposit
  const expiredOrders = await Order.find({
    $or: [
      { endDate: { $lte: now } },
      { status: { $in: ["CANCELLED", "EXPIRED"] } }
    ],
    depositCharged: { $gt: 0 }
  }).toArray();

  console.log(`Found ${expiredOrders.length} expired/cancelled orders with depositCharged > 0.`);

  for (const order of expiredOrders) {
    const existingRefund = await Refund.findOne({
      $or: [{ userId: order.userId }, { userEmail: order.email }],
      planName: order.bundleName
    });

    if (!existingRefund) {
      await Refund.insertOne({
        userId: order.userId || "GUEST",
        userName: order.userName || "Valued Customer",
        userEmail: order.email,
        userPhone: order.phone || "",
        planName: order.bundleName,
        depositAmount: order.depositCharged,
        status: "PENDING",
        cancelledAt: order.endDate || order.updatedAt || new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log(`Created PENDING Deposit Refund for order ${order.bundleOrderId} (${order.email}) - Deposit: ₹${order.depositCharged}`);
    } else {
      console.log(`Refund claim already exists for order ${order.bundleOrderId}`);
    }
  }

  // 2. Sync expired Users with a selectedPlan security deposit
  const expiredUsers = await User.find({
    "selectedPlan.planName": { $exists: true, $ne: "" },
    "selectedPlan.securityDeposit": { $gt: 0 },
    "selectedPlan.endDate": { $lte: now }
  }).toArray();

  console.log(`Found ${expiredUsers.length} expired users with securityDeposit > 0.`);

  for (const u of expiredUsers) {
    const existingRefund = await Refund.findOne({
      $or: [{ userId: u._id.toString() }, { userEmail: u.email }],
      planName: u.selectedPlan.planName
    });

    if (!existingRefund) {
      await Refund.insertOne({
        userId: u._id.toString(),
        userName: u.name,
        userEmail: u.email,
        userPhone: u.mobile || "",
        planName: u.selectedPlan.planName,
        depositAmount: u.selectedPlan.securityDeposit,
        status: "PENDING",
        cancelledAt: u.selectedPlan.endDate || new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log(`Created PENDING Deposit Refund for user ${u.email} - Deposit: ₹${u.selectedPlan.securityDeposit}`);
    } else {
      console.log(`Refund claim already exists for user ${u.email}`);
    }
  }

  const allRefunds = await Refund.find({}).toArray();
  console.log(`Total Deposit Refund claims in MongoDB now: ${allRefunds.length}`);

  process.exit(0);
}

syncRefunds().catch(err => {
  console.error("Sync refunds error:", err);
  process.exit(1);
});
