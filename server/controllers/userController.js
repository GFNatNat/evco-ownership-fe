import User from "../models/User.js";
import { deleteFile } from "../utils/fileUtils.js";
import { writeAudit } from "../utils/audit.js";

export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-passwordHash");
    res.json(user);
  } catch (err) {
    next(err);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const updated = await User.findByIdAndUpdate(req.user.id, req.body, {
      new: true,
    });
    await writeAudit({
      userId: req.user.id,
      action: "user.update",
      entityType: "User",
      entityId: req.user.id,
      message: "Updated profile",
      meta: req.body,
      ip: req.ip,
    });
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

export const uploadDriverLicense = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: "file required" });
    const user = await User.findById(req.user.id);
    user.driverLicense = {
      url: req.file.path,
      expiry: req.body.expiry || null,
    };
    user.verified.driverLicense = false; // pending manual verification
    await user.save();
    await writeAudit({
      userId: req.user.id,
      action: "user.uploadLicense",
      entityType: "User",
      entityId: req.user.id,
      message: "Uploaded driver license",
      meta: { file: req.file.path },
      ip: req.ip,
    });
    res.json(user);
  } catch (err) {
    next(err);
  }
};
