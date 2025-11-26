// src/models/User.js
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const DocumentSchema = new Schema({
  type: {
    type: String,
    enum: ["cccd", "cmnd", "driver_license"],
    required: true,
  },
  url: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
});

const WalletSchema = new Schema({
  balance: { type: Number, default: 0 },
  currency: { type: String, default: "VND" },
});

const UserSchema = new Schema(
  {
    name: { type: String, required: true },

    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String },

    passwordHash: { type: String, required: true },

    roles: {
      type: [String],
      enum: ["Coowner", "Staff", "Admin"],
      default: ["Coowner"],
    },

    verified: {
      idDocs: { type: Boolean, default: false },
      driverLicense: { type: Boolean, default: false },
    },

    idDocuments: [DocumentSchema],

    driverLicense: {
      number: String,
      expiry: Date,
      url: String,
    },

    wallet: WalletSchema,

    preferences: {
      notifyByEmail: { type: Boolean, default: true },
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", UserSchema);
export default User;
