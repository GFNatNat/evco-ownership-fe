const express = require("express");
const router = express.Router();
const disputeCtrl = require("../../controllers/disputeController");

// CRUD
router.post("/", disputeCtrl.createDispute);
router.get("/", disputeCtrl.getDisputes);
router.get("/:id", disputeCtrl.getDisputeById);
router.put("/:id", disputeCtrl.updateDisputeStatus);

// Add message to dispute thread
router.post("/:id/messages", disputeCtrl.addMessage);

// Resolve dispute
router.put("/:id/resolve", disputeCtrl.resolveDispute);

module.exports = router;
