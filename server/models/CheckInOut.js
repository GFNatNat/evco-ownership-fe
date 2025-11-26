// src/models/CheckInOut.js
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const CheckInOutSchema = new Schema(
  {
    bookingId: { type: Schema.Types.ObjectId, ref: "Booking", required: true },
    vehicleId: { type: Schema.Types.ObjectId, ref: "Vehicle", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },

    type: { type: String, enum: ["checkin", "checkout"], required: true },

    timestamp: { type: Date, default: Date.now },

    odometer: Number,
    batteryPercent: Number,

    photoUrl: String,
    signatureUrl: String,

    method: {
      type: String,
      enum: ["qr", "manual", "digital-sign"],
      default: "qr",
    },
  },
  {
    timestamps: true,
  }
);

const CheckInOut = mongoose.model("CheckInOut", CheckInOutSchema);

export default CheckInOut;
