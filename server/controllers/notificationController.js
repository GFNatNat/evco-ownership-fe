import Notification from "../models/Notification.js";
import { writeAudit as wno } from "../utils/audit.js";

export const sendNotification = async (req, res, next) => {
  try {
    const { userId, title, message, type } = req.body;
    const n = await Notification.create({ userId, title, message, type });
    await wno({
      userId: req.user.id,
      action: "notification.send",
      entityType: "Notification",
      entityId: n._id,
      message: "Sent notification",
      meta: { userId, title },
      ip: req.ip,
    });
    res.status(201).json(n);
  } catch (err) {
    next(err);
  }
};

export const getNotifications = async (req, res, next) => {
  try {
    const list = await Notification.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(list);
  } catch (err) {
    next(err);
  }
};

export const markAsRead = async (req, res, next) => {
  try {
    const n = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    res.json(n);
  } catch (err) {
    next(err);
  }
};
