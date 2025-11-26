// src/models/Contract.js
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const SignatureSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    signedAt: Date,
    signatureUrl: String,
    signatureMethod: {
      type: String,
      enum: ["e-sign", "draw", "upload"],
      default: "e-sign",
    },
  },
  { _id: false }
);

const ContractSchema = new Schema(
  {
    groupId: {
      type: Schema.Types.ObjectId,
      ref: "OwnershipGroup",
      required: true,
    },

    parties: [
      {
        userId: { type: Schema.Types.ObjectId, ref: "User" },
        role: String,
      },
    ],

    docUrl: String,

    status: {
      type: String,
      enum: ["draft", "sent", "signed", "archived"],
      default: "draft",
    },

    signatures: [SignatureSchema],
  },
  {
    timestamps: true,
  }
);

const Contract = mongoose.model("Contract", ContractSchema);

export default Contract;
