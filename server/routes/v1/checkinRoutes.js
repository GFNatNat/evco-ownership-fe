import express from "express";
import * as CheckinC from "../../controllers/checkinController.js";
import { authMiddleware } from "../../middlewares/authMiddleware.js";
const checkinRouter = express.Router();
checkinRouter.get("/qr/:vehicleId", authMiddleware, CheckinC.generateQRCode);
checkinRouter.post("/in", authMiddleware, CheckinC.checkInVehicle);
checkinRouter.post("/out", authMiddleware, CheckinC.checkOutVehicle);
checkinRouter.get(
  "/history/:vehicleId",
  authMiddleware,
  CheckinC.getCheckinHistory
);
export default checkinRouter;
