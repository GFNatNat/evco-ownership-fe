import express from "express";
import * as ScheduleC from "../../controllers/scheduleController.js";
import { authMiddleware } from "../../middlewares/authMiddleware.js";
const scheduleRouter = express.Router();
scheduleRouter.get(
  "/vehicle/:id/availability",
  authMiddleware,
  ScheduleC.getAvailableSlots
);
scheduleRouter.post("/book", authMiddleware, ScheduleC.bookSchedule);
scheduleRouter.put("/modify", authMiddleware, ScheduleC.modifySchedule);
scheduleRouter.delete("/cancel/:id", authMiddleware, ScheduleC.cancelSchedule);
scheduleRouter.get("/user", authMiddleware, ScheduleC.getUserSchedule);
scheduleRouter.get(
  "/group/:groupId",
  authMiddleware,
  ScheduleC.getGroupCalendar
);
export default scheduleRouter;
