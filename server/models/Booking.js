// src/models/Booking.js
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const UsageMetricsSchema = new Schema(
  {
    startOdometer: Number,
    endOdometer: Number,
    energyUsedKWh: Number,
  },
  { _id: false }
);

const BookingSchema = new Schema(
  {
    groupId: {
      type: Schema.Types.ObjectId,
      ref: "OwnershipGroup",
      required: true,
    },
    vehicleId: { type: Schema.Types.ObjectId, ref: "Vehicle", required: true },
    requesterId: { type: Schema.Types.ObjectId, ref: "User", required: true },

    startAt: { type: Date, required: true },
    endAt: { type: Date, required: true },

    status: {
      type: String,
      enum: [
        "pending",
        "approved",
        "rejected",
        "active",
        "completed",
        "cancelled",
      ],
      default: "pending",
    },

    usageMetrics: UsageMetricsSchema,

    allocatedBy: { type: Schema.Types.ObjectId, ref: "User" },

    priorityScore: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

BookingSchema.index({ vehicleId: 1, startAt: 1, endAt: 1 });

const Booking = mongoose.model("Booking", BookingSchema);

export default Booking;
