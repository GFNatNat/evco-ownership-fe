import express from "express";
import * as OwnershipC from "../../controllers/ownershipController.js";
import { authMiddleware } from "../../middlewares/authMiddleware.js";
import { authorizeRoles } from "../../middlewares/roleMiddleware.js";
const ownershipRouter = express.Router();
ownershipRouter.post(
  "/assign",
  authMiddleware,
  authorizeRoles("Admin", "Staff", "Coowner"),
  OwnershipC.assignOwnershipShares
);
ownershipRouter.put(
  "/update",
  authMiddleware,
  authorizeRoles("Admin", "Staff"),
  OwnershipC.updateOwnershipShare
);
ownershipRouter.get(
  "/vehicle/:vehicleId",
  authMiddleware,
  OwnershipC.getOwnershipOfVehicle
);
ownershipRouter.delete(
  "/remove/:groupId/:userId",
  authMiddleware,
  authorizeRoles("Admin", "Staff"),
  OwnershipC.removeOwner
);
ownershipRouter.get(
  "/history/:vehicleId",
  authMiddleware,
  OwnershipC.getOwnershipOfVehicle
);
export default ownershipRouter;
