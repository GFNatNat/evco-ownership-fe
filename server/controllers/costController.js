import Expense from "../models/Expense.js";
import OwnershipGroup from "../models/OwnershipGroup.js";
import WalletTransaction from "../models/WalletTransaction.js";
import { writeAudit as wA } from "../utils/audit.js";

export const addCost = async (req, res, next) => {
  try {
    const { groupId, vehicleId, type, amount, splitMethod } = req.body;
    const expense = await Expense.create({
      groupId,
      vehicleId,
      type,
      amount,
      paidBy: req.user.id,
      splitMethod,
      date: new Date(),
      status: "pending",
    });
    await wA({
      userId: req.user.id,
      action: "expense.create",
      entityType: "Expense",
      entityId: expense._id,
      message: "Created expense",
      meta: req.body,
      ip: req.ip,
    });
    res.status(201).json(expense);
  } catch (err) {
    next(err);
  }
};

// simple splitter two modes
export const settleExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) return res.status(404).json({ message: "Not found" });
    const group = await OwnershipGroup.findById(expense.groupId);
    let splits = [];
    if (expense.splitMethod === "ownership" || !expense.splitMethod) {
      splits = group.members.map((m) => ({
        userId: m.userId,
        amount:
          Math.round(expense.amount * (m.ownershipPercentage / 100) * 100) /
          100,
      }));
    } else if (expense.splitMethod === "custom") {
      splits = expense.splitDetails;
    } else if (expense.splitMethod === "usage") {
      // fallback to ownership when usage not provided
      splits = group.members.map((m) => ({
        userId: m.userId,
        amount:
          Math.round(expense.amount * (m.ownershipPercentage / 100) * 100) /
          100,
      }));
    }
    expense.splitDetails = splits;
    expense.status = "settled";
    await expense.save();
    // create wallet transactions (debit each user)
    for (const s of splits) {
      await WalletTransaction.create({
        userId: s.userId,
        groupId: expense.groupId,
        type: "expense_share",
        amount: s.amount,
        reference: `expense:${expense._id}`,
      });
    }
    await wA({
      userId: req.user.id,
      action: "expense.settle",
      entityType: "Expense",
      entityId: expense._id,
      message: "Settled expense",
      meta: { splits },
      ip: req.ip,
    });
    res.json({ expense, splits });
  } catch (err) {
    next(err);
  }
};

export const getCostHistory = async (req, res, next) => {
  try {
    const { groupId } = req.query;
    const list = await Expense.find({ groupId }).sort({ date: -1 });
    res.json(list);
  } catch (err) {
    next(err);
  }
};

export const getOutstanding = async (req, res, next) => {
  try {
    const list = await Expense.find({
      status: "pending",
      groupId: req.query.groupId,
    });
    res.json(list);
  } catch (err) {
    next(err);
  }
};
