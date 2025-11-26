import express from "express";
import * as PaymentC from "../../controllers/paymentController.js";
import { authMiddleware } from "../../middlewares/authMiddleware.js";
const paymentRouter = express.Router();
paymentRouter.post("/create", authMiddleware, PaymentC.createPaymentRequest);
paymentRouter.post("/webhook", PaymentC.webhook);
export default paymentRouter;
