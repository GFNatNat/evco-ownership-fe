import Vote from "../models/Vote.js";
import { writeAudit as wv } from "../utils/audit.js";

export const createVote = async (req, res, next) => {
  try {
    const v = await Vote.create({
      ...req.body,
      startAt: req.body.startAt ? new Date(req.body.startAt) : new Date(),
      endAt: req.body.endAt
        ? new Date(req.body.endAt)
        : new Date(Date.now() + 7 * 24 * 3600 * 1000),
    });
    await wv({
      userId: req.user.id,
      action: "vote.create",
      entityType: "Vote",
      entityId: v._id,
      message: "Created vote",
      meta: req.body,
      ip: req.ip,
    });
    res.status(201).json(v);
  } catch (err) {
    next(err);
  }
};

export const castVote = async (req, res, next) => {
  try {
    const vote = await Vote.findById(req.params.id);
    if (!vote) return res.status(404).json({ message: "Not found" });
    vote.votes.push({
      userId: req.user.id,
      option: req.body.option,
      weight: req.body.weight || 1,
    });
    await vote.save();
    await wv({
      userId: req.user.id,
      action: "vote.cast",
      entityType: "Vote",
      entityId: vote._id,
      message: "Cast vote",
      meta: { option: req.body.option },
      ip: req.ip,
    });
    res.json(vote);
  } catch (err) {
    next(err);
  }
};

export const closeVote = async (req, res, next) => {
  try {
    const v = await Vote.findByIdAndUpdate(
      req.params.id,
      { endAt: new Date() },
      { new: true }
    );
    await wv({
      userId: req.user.id,
      action: "vote.close",
      entityType: "Vote",
      entityId: v._id,
      message: "Closed vote",
      ip: req.ip,
    });
    res.json(v);
  } catch (err) {
    next(err);
  }
};
