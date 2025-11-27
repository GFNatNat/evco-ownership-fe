// routes/v1/adminRoute.js
import express from "express";
import { authMiddleware } from "../../middlewares/authMiddleware.js";
import { authorizeRoles } from "../../middlewares/roleMiddleware.js";
import { AdminController } from "../../controllers/adminController.js";

const adminRouter = express.Router();

adminRouter.use(authMiddleware, authorizeRoles("Admin"));

// ---- GROUP ----
adminRouter.post("/groups", AdminController.createGroup);
adminRouter.put("/groups/:id", AdminController.updateGroup);
adminRouter.delete("/groups/:id", AdminController.deleteGroup);
adminRouter.post("/groups/:id/add-member", AdminController.addMember);
adminRouter.delete(
  "/groups/:id/remove-member/:userId",
  AdminController.removeMember
);
adminRouter.get("/groups/:id", AdminController.getGroupDetails);
adminRouter.get("/groups/:id/fund", AdminController.getGroupFund);
adminRouter.put("/groups/:id/fund", AdminController.updateGroupFund);

// ---- CONTRACT ----
adminRouter.post("/contracts", AdminController.createContract);
adminRouter.post("/contracts/sign/:id", AdminController.signContract);
adminRouter.get("/contracts/:id", AdminController.getContract);

// ---- VEHICLE ----
adminRouter.post("/vehicles", AdminController.createVehicle);
adminRouter.put("/vehicles/:id", AdminController.updateVehicle);
adminRouter.delete("/vehicles/:id", AdminController.deleteVehicle);
adminRouter.get("/vehicles", AdminController.getAllVehicles);
adminRouter.get("/vehicles/:id", AdminController.getVehicleById);

// ---- DISPUTE ----
adminRouter.post("/disputes", AdminController.createDispute);
adminRouter.put("/disputes/:id", AdminController.updateDispute);
adminRouter.put("/disputes/:id/resolve", AdminController.resolveDispute);
adminRouter.get("/disputes", AdminController.getAllDisputes);
adminRouter.get("/disputes/:id", AdminController.getDisputeById);

// ---- REPORT ----
adminRouter.get("/reports/financial", AdminController.generateFinancialReport);
adminRouter.get("/reports/usage", AdminController.generateUsageReport);

export default adminRouter;
