import express from "express";
import * as VehicleC from "../../controllers/vehicleController.js";
import { authMiddleware } from "../../middlewares/authMiddleware.js";
import { authorizeRoles } from "../../middlewares/roleMiddleware.js";
const vehicleRouter = express.Router();
vehicleRouter.post(
  "/",
  authMiddleware,
  authorizeRoles("Admin", "Staff"),
  VehicleC.createVehicle
);
vehicleRouter.get("/", authMiddleware, VehicleC.getAllVehicles);
vehicleRouter.get("/:id", authMiddleware, VehicleC.getVehicleById);
vehicleRouter.put(
  "/:id",
  authMiddleware,
  authorizeRoles("Admin", "Staff"),
  VehicleC.updateVehicle
);
vehicleRouter.delete(
  "/:id",
  authMiddleware,
  authorizeRoles("Admin"),
  VehicleC.deleteVehicle
);
export default vehicleRouter;
