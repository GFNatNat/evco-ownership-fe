// src/models/Vehicle.js
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const VehicleSchema = new Schema(
  {
    vin: { type: String, unique: true },
    plateNumber: { type: String, unique: true, required: true },

    manufacturer: String,
    model: String,

    currentOdometer: { type: Number, default: 0 },

    groupId: { type: Schema.Types.ObjectId, ref: "OwnershipGroup" },

    status: {
      type: String,
      enum: ["available", "in_use", "maintenance"],
      default: "available",
    },

    metadata: {
      batteryHealth: Number,
      lastServiceDate: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Vehicle = mongoose.model("Vehicle", VehicleSchema);
export default Vehicle;
