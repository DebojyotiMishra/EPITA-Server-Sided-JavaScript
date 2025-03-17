const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error("MONGODB_URI is not defined in environment variables");
    }

    await mongoose.connect(uri);
    console.log("MongoDB Connected...");
  } catch (err) {
    console.error("No DB connection!", err.message);
    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
