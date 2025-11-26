import "dotenv/config"; // Load ENV 1 lần duy nhất
import mongoose from "mongoose";
import http from "http";
import app from "./app.js";
import { mongooseQueryLogger } from "./utils/mongooseQueryLogger.js";

// ⚠️ In ra môi trường để debug
console.log("Loaded ENV MONGO_URI:", process.env.MONGO_URI);
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("process.cwd() =", process.cwd());

// ⚠️ Đúng KEY theo file .env
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ ERROR: MONGO_URI is undefined. Check your .env file!");
  process.exit(1);
}

const server = http.createServer(app);

// MongoDB Connect
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected successfully");

    // Logging query
    mongoose.plugin(mongooseQueryLogger);

    server.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err);
    process.exit(1);
  });
