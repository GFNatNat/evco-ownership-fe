// src/config/db.js
import mongoose from "mongoose";
const { MONGO_URI } = require("./env");
const logger = require("./logger");

mongoose.set("strictQuery", true);

async function connectDB() {
  try {
    logger.info(`🔌 Connecting to MongoDB...`);

    await mongoose.connect(MONGO_URI, {
      autoIndex: true,
      maxPoolSize: 50,
      connectTimeoutMS: 10000,
    });

    logger.info("🟢 MongoDB connected successfully");
  } catch (error) {
    logger.error("🔴 MongoDB connection error:", error);
    setTimeout(connectDB, 5000);
  }
}

// Connection event listeners
mongoose.connection.on("error", (err) => {
  logger.error("MongoDB runtime error:", err);
});

mongoose.connection.on("disconnected", () => {
  logger.warn("⚠️ MongoDB disconnected — retrying...");
});

mongoose.connection.on("reconnected", () => {
  logger.info("🟡 MongoDB reconnected");
});

module.exports = connectDB;
