import Dispute from "../models/Dispute.js";
import { writeAudit as wdi } from "../utils/audit.js";

export const createDispute = async (req, res, next) => {
  try {
    const d = await Dispute.create({
      ...req.body,
      createdBy: req.user.id,
      status: "open",
    });
    await wdi({
      userId: req.user.id,
      action: "dispute.create",
      entityType: "Dispute",
      entityId: d._id,
      message: "Created dispute",
      meta: req.body,
      ip: req.ip,
    });
    res.status(201).json(d);
  } catch (err) {
    next(err);
  }
};

export const updateDispute = async (req, res, next) => {
  try {
    const d = await Dispute.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    await wdi({
      userId: req.user.id,
      action: "dispute.update",
      entityType: "Dispute",
      entityId: d._1d,
      message: "Updated dispute",
      meta: req.body,
      ip: req.ip,
    });
    res.json(d);
  } catch (err) {
    next(err);
  }
};

export const resolveDispute = async (req, res, next) => {
  try {
    const d = await Dispute.findByIdAndUpdate(
      req.params.id,
      { status: "resolved", resolvedBy: req.user.id, resolvedAt: new Date() },
      { new: true }
    );
    await wdi({
      userId: req.user.id,
      action: "dispute.resolve",
      entityType: "Dispute",
      entityId: d._id,
      message: "Resolved dispute",
      meta: null,
      ip: req.ip,
    });
    res.json(d);
  } catch (err) {
    next(err);
  }
};

export const getAllDisputes = async (req, res, next) => {
  try {
    const list = await Dispute.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    next(err);
  }
};

export const getDisputeById = async (req, res, next) => {
  try {
    const d = await Dispute.findById(req.params.id);
    res.json(d);
  } catch (err) {
    next(err);
  }
};
