import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";
import { upload } from "../middlewares/uploadMiddleware.js";
import { refreshTokenMiddleware } from "../middlewares/refreshTokenMiddleware.js";

// Controllers
import Auth from "../controllers/authController.js";
import User from "../controllers/userController.js";
import Ownership from "../controllers/ownershipController.js";
import Schedule from "../controllers/scheduleController.js";
import Cost from "../controllers/costController.js";
import Payment from "../controllers/paymentController.js";
import Vehicle from "../controllers/vehicleController.js";
import Group from "../controllers/groupController.js";
import Vote from "../controllers/voteController.js";
import Admin from "../controllers/adminController.js";

const router = Router();

// ---------- Auth Routes ----------
router.post("/auth/register", Auth.register);
router.post("/auth/login", Auth.login);
router.post("/auth/refresh-token", refreshTokenMiddleware);

// ---------- User Routes ----------
router.get("/user/me", authMiddleware, User.getProfile);
router.put("/user/update", authMiddleware, User.updateProfile);

// ---------- Ownership Routes ----------
router.post("/ownership/create", authMiddleware, Ownership.createOwnership);
router.post(
  "/ownership/econtract",
  authMiddleware,
  upload.single("contract"),
  Ownership.uploadEContract
);

// ---------- Schedule Routes ----------
router.post("/schedule/book", authMiddleware, Schedule.createBooking);
router.get("/schedule/slots", authMiddleware, Schedule.getAvailableSlots);

// ---------- Cost Routes ----------
router.post("/cost/add", authMiddleware, Cost.addCost);
router.get("/cost/summary", authMiddleware, Cost.getCostSummary);

// ---------- Payment Routes ----------
router.post("/payment/create", authMiddleware, Payment.createPayment);
router.get("/payment/history", authMiddleware, Payment.getPaymentHistory);

// ---------- Vehicle Routes ----------
router.post(
  "/vehicle/add",
  authMiddleware,
  authorizeRoles("Admin", "Staff"),
  Vehicle.addVehicle
);
router.get("/vehicle/list", authMiddleware, Vehicle.getVehicles);

// ---------- Group Routes ----------
router.post("/group/create", authMiddleware, Group.createGroup);
router.post("/group/:groupId/member/add", authMiddleware, Group.addMember);

// ---------- Vote Routes ----------
router.post("/vote/create", authMiddleware, Vote.createVote);
router.post("/vote/:voteId/submit", authMiddleware, Vote.submitVote);

// ---------- Admin/Staff Routes ----------
router.get(
  "/admin/groups",
  authMiddleware,
  authorizeRoles("Admin", "Staff"),
  Admin.getAllGroups
);
router.put(
  "/admin/dispute/:id/resolve",
  authMiddleware,
  authorizeRoles("Admin", "Staff"),
  Admin.resolveDispute
);

export default router;
