import OwnershipGroup from "../models/OwnershipGroup.js";
import WalletTransaction from "../models/WalletTransaction.js";
import { writeAudit as wa } from "../utils/audit.js";

export const createGroup = async (req, res, next) => {
  try {
    const group = await OwnershipGroup.create({
      ...req.body,
      createdAt: new Date(),
    });
    await wa({
      userId: req.user.id,
      action: "group.create",
      entityType: "Group",
      entityId: group._id,
      message: "Created group",
      meta: req.body,
      ip: req.ip,
    });
    res.status(201).json(group);
  } catch (err) {
    next(err);
  }
};

export const updateGroup = async (req, res, next) => {
  try {
    const group = await OwnershipGroup.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    await wa({
      userId: req.user.id,
      action: "group.update",
      entityType: "Group",
      entityId: group._id,
      message: "Updated group",
      meta: req.body,
      ip: req.ip,
    });
    res.json(group);
  } catch (err) {
    next(err);
  }
};

export const deleteGroup = async (req, res, next) => {
  try {
    await GroupModel.findByIdAndDelete(req.params.id);
    await wa({
      userId: req.user.id,
      action: "group.delete",
      entityType: "Group",
      entityId: req.params.id,
      message: "Deleted group",
      ip: req.ip,
    });
    res.json({ message: "deleted" });
  } catch (err) {
    next(err);
  }
};

export const addMember = async (req, res, next) => {
  try {
    const group = await OwnershipGroup.findById(req.params.id);
    group.members.push(req.body.member);
    await group.save();
    await wa({
      userId: req.user.id,
      action: "group.addMember",
      entityType: "Group",
      entityId: group._id,
      message: "Added member",
      meta: req.body.member,
      ip: req.ip,
    });
    res.json(group);
  } catch (err) {
    next(err);
  }
};

export const removeMember = async (req, res, next) => {
  try {
    const group = await OwnershipGroup.findById(req.params.id);
    group.members = group.members.filter(
      (m) => m.userId.toString() !== req.params.userId
    );
    await group.save();
    await wa({
      userId: req.user.id,
      action: "group.removeMember",
      entityType: "Group",
      entityId: group._id,
      message: `Removed ${req.params.userId}`,
      ip: req.ip,
    });
    res.json(group);
  } catch (err) {
    next(err);
  }
};

export const getGroupDetails = async (req, res, next) => {
  try {
    const group = await OwnershipGroup.findById(req.params.id).populate(
      "members.userId",
      "name email"
    );
    res.json(group);
  } catch (err) {
    next(err);
  }
};

export const getGroupFund = async (req, res, next) => {
  try {
    const group = await OwnershipGroup.findById(req.params.id);
    res.json(group.commonFund);
  } catch (err) {
    next(err);
  }
};

export const updateGroupFund = async (req, res, next) => {
  try {
    const { amount } = req.body;
    const group = await OwnershipGroup.findById(req.params.id);
    group.commonFund.balance += amount;
    await group.save();
    await WalletTransaction.create({
      userId: req.user.id,
      groupId: group._id,
      type: "topup",
      amount,
      reference: "group_fund_topup",
    });
    await wa({
      userId: req.user.id,
      action: "group.fundUpdate",
      entityType: "Group",
      entityId: group._id,
      message: `Topup ${amount}`,
      meta: { amount },
      ip: req.ip,
    });
    res.json(group.commonFund);
  } catch (err) {
    next(err);
  }
};
