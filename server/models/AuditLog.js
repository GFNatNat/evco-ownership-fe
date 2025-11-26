import mongoose from "mongoose";
const { Schema } = mongoose;

const AuditLogSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    action: { type: String, required: true }, // e.g. 'booking.create', 'expense.settle'
    entityType: String, // e.g. 'Booking', 'Expense'
    entityId: Schema.Types.ObjectId,
    message: String,
    meta: Schema.Types.Mixed,
    ip: String,
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

AuditLogSchema.index({ userId: 1, action: 1, createdAt: -1 });

export default mongoose.model("AuditLog", AuditLogSchema);
