require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");

const authRoutes = require("./routes/function/authRoutes.js");
app.use("/auth", authRoutes);

const errorHandler = require("./middlewares/errorHandler.js");
app.use(errorHandler);

const app = express();
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);
app.use("/uploads", express.static(process.env.UPLOAD_DIR || "uploads"));

// connect
mongoose
  .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/evco")
  .then(() => console.log("mongo ok"))
  .catch((e) => console.error(e));

// routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/groups", require("./routes/groups"));
app.use("/api/bookings", require("./routes/bookings"));
app.use("/api/costs", require("./routes/costs"));
app.use("/api/fileUpload", require("./routes/fileUpload"));
app.use("/api/staff", require("./routes/staff"));
app.use("/api/admin", require("./routes/admin"));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: err.message || "Server error" });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log("server on", PORT));
