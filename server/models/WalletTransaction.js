// src/models/WalletTransaction.js
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const WalletTransactionSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    groupId: { type: Schema.Types.ObjectId, ref: "OwnershipGroup" },

    type: {
      type: String,
      enum: ["topup", "payout", "expense_share", "refund"],
      required: true,
    },

    amount: { type: Number, required: true },
    currency: { type: String, default: "VND" },

    reference: String,
  },
  {
    timestamps: true,
  }
);

const WalletTransaction = mongoose.model(
  "WalletTransaction",
  WalletTransactionSchema
);
export default WalletTransaction;
