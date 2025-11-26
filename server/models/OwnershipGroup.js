// src/models/OwnershipGroup.js
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const MemberSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    ownershipPercentage: { type: Number, required: true },
    role: {
      type: String,
      enum: ["owner", "groupAdmin", "member"],
      default: "owner",
    },
  },
  { _id: false }
);

const OwnershipGroupSchema = new Schema(
  {
    name: { type: String, required: true },

    vehicleId: { type: Schema.Types.ObjectId, ref: "Vehicle", required: true },

    members: [MemberSchema],

    commonFund: {
      balance: { type: Number, default: 0 },
      currency: { type: String, default: "VND" },
    },

    policies: {
      bookingPriority: {
        type: String,
        enum: ["proportional", "equal", "hybrid"],
        default: "proportional",
      },
      costSplitMethod: {
        type: String,
        enum: ["ownership", "usage"],
        default: "ownership",
      },
    },

    votes: [{ type: Schema.Types.ObjectId, ref: "Vote" }],
  },
  {
    timestamps: true,
  }
);

const OwnershipGroup = mongoose.model("OwnershipGroup", OwnershipGroupSchema);

export default OwnershipGroup;
