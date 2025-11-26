import CheckInOut from "../models/CheckInOut.js";
import Booking from "../models/Booking.js";
import { writeAudit as wci } from "../utils/audit.js";

export const generateQRCode = async (req, res, next) => {
  try {
    // Implementation detail left to frontend; return payload stub
    res.json({
      vehicleId: req.params.vehicleId,
      qrcodePayload: `vehicle:${req.params.vehicleId}:ts:${Date.now()}`,
    });
  } catch (err) {
    next(err);
  }
};

export const checkInVehicle = async (req, res, next) => {
  try {
    const { bookingId, odometer, batteryPercent, photoUrl } = req.body;
    const b = await Booking.findById(bookingId);
    if (!b) return res.status(404).json({ message: "Booking not found" });
    b.status = "active";
    await b.save();
    const rec = await CheckInOut.create({
      bookingId,
      vehicleId: b.vehicleId,
      userId: req.user.id,
      type: "checkin",
      odometer,
      batteryPercent,
      photoUrl,
      method: req.body.method || "qr",
    });
    await wci({
      userId: req.user.id,
      action: "vehicle.checkin",
      entityType: "CheckInOut",
      entityId: rec._id,
      message: "Checked in",
      meta: { bookingId },
      ip: req.ip,
    });
    res.json(rec);
  } catch (err) {
    next(err);
  }
};

export const checkOutVehicle = async (req, res, next) => {
  try {
    const { bookingId, odometer, batteryPercent, photoUrl, energyUsedKWh } =
      req.body;
    const b = await Booking.findById(bookingId);
    if (!b) return res.status(404).json({ message: "Booking not found" });
    b.status = "completed";
    b.usageMetrics = {
      startOdometer: b.usageMetrics?.startOdometer || null,
      endOdometer: odometer,
      energyUsedKWh,
    };
    await b.save();
    const rec = await CheckInOut.create({
      bookingId,
      vehicleId: b.vehicleId,
      userId: req.user.id,
      type: "checkout",
      odometer,
      batteryPercent,
      photoUrl,
      method: req.body.method || "qr",
    });
    await wci({
      userId: req.user.id,
      action: "vehicle.checkout",
      entityType: "CheckInOut",
      entityId: rec._id,
      message: "Checked out",
      meta: { bookingId, energyUsedKWh },
      ip: req.ip,
    });
    res.json(rec);
  } catch (err) {
    next(err);
  }
};

export const getCheckinHistory = async (req, res, next) => {
  try {
    const list = await CheckInOut.find({
      vehicleId: req.params.vehicleId,
    }).sort({ timestamp: -1 });
    res.json(list);
  } catch (err) {
    next(err);
  }
};
