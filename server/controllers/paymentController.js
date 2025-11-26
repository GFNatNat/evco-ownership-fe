import Payment from "../models/WalletTransaction.js";
import { writeAudit as wP } from "../utils/audit.js";

export const createPaymentRequest = async (req, res, next) => {
  try {
    const { amount, method } = req.body;
    const p = await Payment.create({
      userId: req.user.id,
      type: "topup",
      amount,
      reference: method || "manual",
    });
    await wP({
      userId: req.user.id,
      action: "payment.create",
      entityType: "Payment",
      entityId: p._id,
      message: "Created payment request",
      meta: { amount, method },
      ip: req.ip,
    });
    res.status(201).json(p);
  } catch (err) {
    next(err);
  }
};

export const webhook = async (req, res, next) => {
  // implement gateway logic
  res.json({ received: true });
};
