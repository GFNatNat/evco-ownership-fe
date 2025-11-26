import OwnershipGroup from "../models/OwnershipGroup.js";
import { writeAudit as write } from "../utils/audit.js";

export const assignOwnershipShares = async (req, res, next) => {
  try {
    const { vehicleId, members } = req.body; // members: [{ userId, ownershipPercentage, role }]
    const group = await OwnershipGroup.create({
      name: req.body.name || `Group-${vehicleId}`,
      vehicleId,
      members,
      commonFund: { balance: 0 },
    });
    await write({
      userId: req.user.id,
      action: "ownership.assign",
      entityType: "OwnershipGroup",
      entityId: group._id,
      message: "Assigned ownership shares",
      meta: members,
      ip: req.ip,
    });
    res.status(201).json(group);
  } catch (err) {
    next(err);
  }
};

export const updateOwnershipShare = async (req, res, next) => {
  try {
    const { groupId, members } = req.body;
    const group = await OwnershipGroup.findByIdAndUpdate(
      groupId,
      { members },
      { new: true }
    );
    await write({
      userId: req.user.id,
      action: "ownership.update",
      entityType: "OwnershipGroup",
      entityId: groupId,
      message: "Updated shares",
      meta: members,
      ip: req.ip,
    });
    res.json(group);
  } catch (err) {
    next(err);
  }
};

export const getOwnershipOfVehicle = async (req, res, next) => {
  try {
    const group = await OwnershipGroup.findOne({
      vehicleId: req.params.vehicleId,
    }).populate("members.userId", "name email");
    res.json(group);
  } catch (err) {
    next(err);
  }
};

export const removeOwner = async (req, res, next) => {
  try {
    const { groupId, userId } = req.params;
    const group = await OwnershipGroup.findById(groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });
    group.members = group.members.filter(
      (m) => m.userId.toString() !== userId.toString()
    );
    await group.save();
    await write({
      userId: req.user.id,
      action: "ownership.remove",
      entityType: "OwnershipGroup",
      entityId: groupId,
      message: `Removed owner ${userId}`,
      meta: null,
      ip: req.ip,
    });
    res.json(group);
  } catch (err) {
    next(err);
  }
};
