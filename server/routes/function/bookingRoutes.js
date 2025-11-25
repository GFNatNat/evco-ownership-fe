const express = require("express");
const router = express.Router();
const bookingCtrl = require("../../controllers/bookingController");

router.post("/", bookingCtrl.createBooking);
router.get("/", bookingCtrl.getAllBookings);
router.get("/:id", bookingCtrl.getBookingById);
router.put("/:id", bookingCtrl.updateBooking);
router.delete("/:id", bookingCtrl.cancelBooking);

// Calendar
router.get("/vehicle/:vehicleId/calendar", bookingCtrl.getVehicleCalendar);

// Fairness priority
router.post("/request", bookingCtrl.requestBookingWithPriority);

// Stats
router.get("/user/:userId/history", bookingCtrl.getUserHistory);

module.exports = router;
