const express = require("express");
const router = express.Router();
const serviceCtrl = require("../../controllers/serviceJobController");

// CRUD
router.post("/", serviceCtrl.createJob);
router.get("/", serviceCtrl.getJobs);
router.get("/:id", serviceCtrl.getJobById);
router.put("/:id", serviceCtrl.updateJob);
router.delete("/:id", serviceCtrl.deleteJob);

// Approvals
router.put("/:id/approve", serviceCtrl.approveJob);
router.put("/:id/reject", serviceCtrl.rejectJob);

// Complete job
router.put("/:id/complete", serviceCtrl.completeJob);

module.exports = router;
