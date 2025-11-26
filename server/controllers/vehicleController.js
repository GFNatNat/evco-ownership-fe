import Vehicle from "../models/Vehicle.js";
import OwnershipGroup from "../models/OwnershipGroup.js";
import { writeAudit as audit } from "../utils/audit.js";

export const createVehicle = async (req, res, next) => {
  try {
    const v = await Vehicle.create(req.body);
    await audit({
      userId: req.user.id,
      action: "vehicle.create",
      entityType: "Vehicle",
      entityId: v._id,
      message: "Created vehicle",
      meta: req.body,
      ip: req.ip,
    });
    res.status(201).json(v);
  } catch (err) {
    next(err);
  }
};

export const getAllVehicles = async (req, res, next) => {
  try {
    const list = await Vehicle.find();
    res.json(list);
  } catch (err) {
    next(err);
  }
};

export const getVehicleById = async (req, res, next) => {
  try {
    const v = await Vehicle.findById(req.params.id);
    if (!v) return res.status(404).json({ message: "Not found" });
    res.json(v);
  } catch (err) {
    next(err);
  }
};

export const updateVehicle = async (req, res, next) => {
  try {
    const v = await Vehicle.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    await audit({
      userId: req.user.id,
      action: "vehicle.update",
      entityType: "Vehicle",
      entityId: req.params.id,
      message: "Updated vehicle",
      meta: req.body,
      ip: req.ip,
    });
    res.json(v);
  } catch (err) {
    next(err);
  }
};

export const deleteVehicle = async (req, res, next) => {
  try {
    await Vehicle.findByIdAndDelete(req.params.id);
    await OwnershipGroup.updateMany(
      { vehicleId: req.params.id },
      { $unset: { vehicleId: "" } }
    );
    await audit({
      userId: req.user.id,
      action: "vehicle.delete",
      entityType: "Vehicle",
      entityId: req.params.id,
      message: "Deleted vehicle",
      ip: req.ip,
    });
    res.json({ message: "deleted" });
  } catch (err) {
    next(err);
  }
};
