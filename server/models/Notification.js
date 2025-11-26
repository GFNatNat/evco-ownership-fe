// src/models/Notification.js
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const NotificationSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    title: String,
    message: String,

    type: {
      type: String,
      enum: ["booking", "payment", "system", "vote", "contract"],
      default: "system",
    },

    read: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Notification", NotificationSchema);
