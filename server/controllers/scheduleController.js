import Booking from "../models/Booking.js";
import Vehicle from "../models/Vehicle.js";
import OwnershipGroup from "../models/OwnershipGroup.js";
import { isOverlapping } from "../utils/dateUtils.js";
import { writeAudit as writeA } from "../utils/audit.js";
import bus from "../events/index.js";

// Priority calculation helper
async function calcPriority(groupId, userId) {
  const group = await OwnershipGroup.findById(groupId);
  const member = group.members.find(
    (m) => m.userId.toString() === userId.toString()
  );
  const ownership = member ? member.ownershipPercentage : 0;
  // basic algorithm: ownership percent minus simple usage penalty (placeholder)
  // usage penalty would be derived from past bookings - simplified here
  const pastUsage = await Booking.countDocuments({
    requesterId: userId,
    groupId,
    status: "completed",
  });
  const score = ownership - pastUsage * 0.5;
  return score;
}

export const getAvailableSlots = async (req, res, next) => {
  try {
    const { vehicleId, from, to } = req.query;
    const qFrom = from ? new Date(from) : new Date();
    const qTo = to ? new Date(to) : new Date(Date.now() + 7 * 24 * 3600 * 1000);
    const bookings = await Booking.find({
      vehicleId,
      status: { $in: ["approved", "active"] },
      $or: [
        { startAt: { $lt: qTo, $gte: qFrom } },
        { endAt: { $gt: qFrom, $lte: qTo } },
      ],
    });
    res.json({ bookings });
  } catch (err) {
    next(err);
  }
};

export const bookSchedule = async (req, res, next) => {
  try {
    const { groupId, vehicleId, startAt, endAt } = req.body;
    // membership check
    const group = await OwnershipGroup.findById(groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });
    const isMember = group.members.some(
      (m) => m.userId.toString() === req.user.id.toString()
    );
    if (!isMember) return res.status(403).json({ message: "Not group member" });
    // conflict check
    const conflict = await Booking.findOne({
      vehicleId,
      status: { $in: ["approved", "active"] },
      $or: [
        { startAt: { $lt: new Date(endAt), $gte: new Date(startAt) } },
        { endAt: { $gt: new Date(startAt), $lte: new Date(endAt) } },
      ],
    });
    if (conflict) return res.status(409).json({ message: "Time conflict" });
    const priorityScore = await calcPriority(groupId, req.user.id);
    const booking = await Booking.create({
      groupId,
      vehicleId,
      requesterId: req.user.id,
      startAt: new Date(startAt),
      endAt: new Date(endAt),
      status: "pending",
      priorityScore,
    });
    await writeA({
      userId: req.user.id,
      action: "booking.create",
      entityType: "Booking",
      entityId: booking._id,
      message: "Created booking request",
      meta: { startAt, endAt },
      ip: req.ip,
    });
    bus.emit("booking.created", {
      bookingId: booking._id,
      userId: req.user.id,
      groupId,
    });
    // auto-approve simple policy
    if (priorityScore >= 0) {
      booking.status = "approved";
      await booking.save();
      bus.emit("booking.approved", { bookingId: booking._id });
    }
    res.status(201).json(booking);
  } catch (err) {
    next(err);
  }
};

export const cancelSchedule = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Not found" });
    if (
      booking.requesterId.toString() !== req.user.id.toString() &&
      !req.user.roles.includes("Admin")
    )
      return res.status(403).json({ message: "Forbidden" });
    booking.status = "cancelled";
    await booking.save();
    await writeA({
      userId: req.user.id,
      action: "booking.cancel",
      entityType: "Booking",
      entityId: booking._id,
      message: "Cancelled booking",
      ip: req.ip,
    });
    res.json(booking);
  } catch (err) {
    next(err);
  }
};

export const modifySchedule = async (req, res, next) => {
  try {
    const b = await Booking.findById(req.body.bookingId);
    if (!b) return res.status(404).json({ message: "Not found" });
    // simple update
    b.startAt = req.body.startAt ? new Date(req.body.startAt) : b.startAt;
    b.endAt = req.body.endAt ? new Date(req.body.endAt) : b.endAt;
    await b.save();
    await writeA({
      userId: req.user.id,
      action: "booking.modify",
      entityType: "Booking",
      entityId: b._id,
      message: "Modified booking",
      meta: { startAt: b.startAt, endAt: b.endAt },
      ip: req.ip,
    });
    res.json(b);
  } catch (err) {
    next(err);
  }
};

export const getUserSchedule = async (req, res, next) => {
  try {
    const list = await Booking.find({ requesterId: req.user.id }).sort({
      startAt: -1,
    });
    res.json(list);
  } catch (err) {
    next(err);
  }
};

export const getGroupCalendar = async (req, res, next) => {
  try {
    const list = await Booking.find({ groupId: req.params.groupId }).sort({
      startAt: 1,
    });
    res.json(list);
  } catch (err) {
    next(err);
  }
};
