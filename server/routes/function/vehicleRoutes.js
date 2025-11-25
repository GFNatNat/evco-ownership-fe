const express = require("express");
const router = express.Router();
const vehicleCtrl = require("../../controllers/vehicleController");

router.post("/", vehicleCtrl.createVehicle);
router.get("/", vehicleCtrl.getVehicles);
router.get("/:id", vehicleCtrl.getVehicleById);
router.put("/:id", vehicleCtrl.updateVehicle);
router.delete("/:id", vehicleCtrl.deleteVehicle);

// Assign to group
router.put("/:vehicleId/group/:groupId", vehicleCtrl.assignVehicleToGroup);

// Check-in / Check-out
router.post("/:vehicleId/checkin", vehicleCtrl.checkIn);
router.post("/:vehicleId/checkout", vehicleCtrl.checkOut);

router.post("/:vehicleId/upload-images", vehicleCtrl.uploadConditionImages);

// Vehicle usage history
router.get("/:vehicleId/usage", vehicleCtrl.getUsageHistory);

module.exports = router;
