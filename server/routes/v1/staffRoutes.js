// routes/v1/staffRoute.js
import express from "express";
import { authMiddleware } from "../../middlewares/authMiddleware.js";
import { authorizeRoles } from "../../middlewares/roleMiddleware.js";
import { StaffController } from "../../controllers/staffController.js";

const staffRouter = express.Router();

staffRouter.use(authMiddleware, authorizeRoles("Admin", "Staff"));

// ---- GROUP ----
staffRouter.post("/groups", StaffController.createGroup);
staffRouter.put("/groups/:id", StaffController.updateGroup);
staffRouter.post("/groups/:id/add-member", StaffController.addMember);
staffRouter.delete(
  "/groups/:id/remove-member/:userId",
  StaffController.removeMember
);
staffRouter.get("/groups/:id", StaffController.getGroupDetails);

// ---- CONTRACT ----
staffRouter.post("/contracts", StaffController.createContract);
staffRouter.post("/contracts/sign/:id", StaffController.signContract);
staffRouter.get("/contracts/:id", StaffController.getContract);

// ---- VEHICLE ----
staffRouter.post("/vehicles", StaffController.createVehicle);
staffRouter.put("/vehicles/:id", StaffController.updateVehicle);
staffRouter.get("/vehicles", StaffController.getAllVehicles);
staffRouter.get("/vehicles/:id", StaffController.getVehicleById);

// ---- CHECKIN / CHECKOUT ----
staffRouter.get("/checkin/qr/:vehicleId", StaffController.generateQRCode);
staffRouter.post("/checkin/in", StaffController.checkInVehicle);
staffRouter.post("/checkin/out", StaffController.checkOutVehicle);
staffRouter.get(
  "/checkin/history/:vehicleId",
  StaffController.getCheckinHistory
);

// ---- DISPUTE ----
staffRouter.post("/disputes", StaffController.createDispute);
staffRouter.put("/disputes/:id", StaffController.updateDispute);
staffRouter.get("/disputes", StaffController.getAllDisputes);
staffRouter.get("/disputes/:id", StaffController.getDisputeById);

// ---- REPORT ----
staffRouter.get("/reports/financial", StaffController.generateFinancialReport);
staffRouter.get("/reports/usage", StaffController.generateUsageReport);

export default staffRouter;
