const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/close";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  mobile: { type: String, default: "9999999999" },
  address: { type: String, default: "ClosetRush HQ, Delhi NCR" },
  accountType: { type: String, default: "Individual User" },
  role: { type: String, default: "admin" },
  status: { type: String, default: "ACTIVE" },
  hasPaidDeposit: { type: Boolean, default: false }
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);

async function seedAdmin() {
  try {
    console.log("Connecting to MongoDB at:", MONGODB_URI);
    await mongoose.connect(MONGODB_URI);

    // Delete existing admin or clean users
    await User.deleteMany({ email: "admin@closetrush.com" });

    // Hash password
    const hashedPassword = await bcrypt.hash("adminpassword", 10);

    const admin = await User.create({
      name: "ClosetRush Admin",
      email: "admin@closetrush.com",
      password: hashedPassword,
      mobile: "9999999999",
      address: "ClosetRush HQ, Delhi NCR",
      accountType: "Individual User",
      role: "admin",
      status: "ACTIVE"
    });

    console.log("✅ SUCCESS: Database seeded with Admin credentials!");
    console.log("-----------------------------------------------");
    console.log("Email    :", admin.email);
    console.log("Password : adminpassword");
    console.log("Role     :", admin.role);
    console.log("Status   :", admin.status);
    console.log("-----------------------------------------------");

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("❌ Seed Error:", error);
    process.exit(1);
  }
}

seedAdmin();
