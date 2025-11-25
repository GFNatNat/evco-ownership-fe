const DisputeSchema = new mongoose.Schema({
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Booking",
    required: true,
  },
  raisedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  against: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  reason: { type: String, required: true },
  evidence: [{ type: String }],
  status: {
    type: String,
    enum: ["open", "in-review", "resolved", "rejected"],
    default: "open",
  },
  resolution: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Dispute", DisputeSchema);
