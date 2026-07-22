import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/closetrush";

async function fixDates() {
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB.");

  const User = mongoose.connection.collection("users");
  const Order = mongoose.connection.collection("orders");

  const users = await User.find({ "selectedPlan.planName": { $exists: true } }).toArray();
  console.log(`Found ${users.length} users with plans.`);

  for (const u of users) {
    if (u.selectedPlan && u.selectedPlan.startDate) {
      let startDate = new Date(u.selectedPlan.startDate);
      let endDate = u.selectedPlan.endDate ? new Date(u.selectedPlan.endDate) : new Date(startDate);
      
      if (!u.selectedPlan.endDate) {
        const dur = (u.selectedPlan.duration || "").toLowerCase();
        if (dur.includes("3 month") || dur.includes("quarterly")) {
          endDate.setMonth(endDate.getMonth() + 3);
        } else if (dur.includes("6 month") || dur.includes("half")) {
          endDate.setMonth(endDate.getMonth() + 6);
        } else if (dur.includes("12 month") || dur.includes("year") || dur.includes("annual")) {
          endDate.setFullYear(endDate.getFullYear() + 1);
        } else {
          endDate.setMonth(endDate.getMonth() + 1);
        }

        await User.updateOne(
          { _id: u._id },
          { $set: { "selectedPlan.endDate": endDate } }
        );
        console.log(`Updated user ${u.email} endDate to: ${endDate.toISOString()}`);
      }

      // Update matching orders for this user
      const userOrders = await Order.find({
        $or: [{ userId: u._id.toString() }, { email: u.email }]
      }).toArray();

      for (const order of userOrders) {
        if (!order.endDate) {
          await Order.updateOne(
            { _id: order._id },
            { $set: { endDate: endDate } }
          );
          console.log(`Updated order ${order.bundleOrderId || order._id} endDate to: ${endDate.toISOString()}`);
        }
      }
    }
  }

  console.log("Database dates synced successfully!");
  process.exit(0);
}

fixDates().catch(err => {
  console.error("Fix dates error:", err);
  process.exit(1);
});
