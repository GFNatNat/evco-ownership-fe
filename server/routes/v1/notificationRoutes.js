import express from "express";
import * as NotificationC from "../../controllers/notificationController.js";
import { authMiddleware } from "../../middlewares/authMiddleware.js";
const notificationRouter = express.Router();
notificationRouter.post(
  "/send",
  authMiddleware,
  NotificationC.sendNotification
);
notificationRouter.get("/", authMiddleware, NotificationC.getNotifications);
notificationRouter.put("/:id/read", authMiddleware, NotificationC.markAsRead);
export default notificationRouter;
