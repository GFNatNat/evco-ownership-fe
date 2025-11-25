const express = require("express");
const router = express.Router();
const paymentCtrl = require("../../controllers/paymentController");

router.post("/", paymentCtrl.createPayment);
router.get("/", paymentCtrl.getPayments);
router.get("/:id", paymentCtrl.getPaymentById);

// Split cost
router.post("/:paymentId/split/ownership", paymentCtrl.splitByOwnership);
router.post("/:paymentId/split/usage", paymentCtrl.splitByUsage);

// Monthly report
router.get("/group/:groupId/report/monthly", paymentCtrl.getMonthlyReport);

module.exports = router;
