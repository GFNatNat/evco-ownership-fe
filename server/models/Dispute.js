import mongoose from "mongoose";
const disputeSchema = new mongoose.Schema(
  {
    group: { type: mongoose.Schema.Types.ObjectId, ref: "Group" },
    raisedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    content: String,
    status: { type: String, enum: ["open", "resolved"], default: "open" },
  },
  { timestamps: true }
);

export default mongoose.model("Dispute", disputeSchema);
