import Expense from "../models/Expense.js";
import Booking from "../models/Booking.js";

export const generateFinancialReport = async (req, res, next) => {
  try {
    const { groupId, from, to } = req.query;
    const f = from
      ? new Date(from)
      : new Date(Date.now() - 30 * 24 * 3600 * 1000);
    const t = to ? new Date(to) : new Date();
    const expenses = await Expense.find({
      groupId,
      date: { $gte: f, $lte: t },
    });
    const total = expenses.reduce((s, e) => s + e.amount, 0);
    res.json({ total, expenses });
  } catch (err) {
    next(err);
  }
};

export const generateUsageReport = async (req, res, next) => {
  try {
    const { groupId, from, to } = req.query;
    const bookings = await Booking.find({
      groupId,
      startAt: { $gte: new Date(from || 0), $lte: new Date(to || Date.now()) },
    });
    res.json({ bookings });
  } catch (err) {
    next(err);
  }
};
