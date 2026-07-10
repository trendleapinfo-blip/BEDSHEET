const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

// Read .env file manually
const envPath = path.join(__dirname, "../.env");
const envContent = fs.readFileSync(envPath, "utf8");
const env = {};
envContent.split("\n").forEach((line) => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    const key = match[1];
    let value = match[2] || "";
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.substring(1, value.length - 1);
    }
    env[key] = value;
  }
});

const uri = env.MONGODB_URI || "mongodb://127.0.0.1:27017/close";
console.log("Using URI:", uri);

mongoose.connect(uri)
  .then(() => {
    console.log("MongoDB connection success!");
    process.exit(0);
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err);
    process.exit(1);
  });
