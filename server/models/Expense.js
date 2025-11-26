// src/models/Expense.js
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const SplitDetailSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    amount: Number,
  },
  { _id: false }
);

const ExpenseSchema = new Schema(
  {
    groupId: {
      type: Schema.Types.ObjectId,
      ref: "OwnershipGroup",
      required: true,
    },
    vehicleId: { type: Schema.Types.ObjectId, ref: "Vehicle" },

    type: {
      type: String,
      enum: [
        "charging",
        "maintenance",
        "insurance",
        "registration",
        "cleaning",
        "other",
      ],
      required: true,
    },

    amount: { type: Number, required: true },
    currency: { type: String, default: "VND" },

    paidBy: { type: Schema.Types.ObjectId, ref: "User", required: true },

    date: { type: Date, default: Date.now },

    splitMethod: {
      type: String,
      enum: ["ownership", "usage", "custom"],
      default: "ownership",
    },

    splitDetails: [SplitDetailSchema],

    receiptUrl: String,

    status: {
      type: String,
      enum: ["pending", "settled"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Expense", ExpenseSchema);
