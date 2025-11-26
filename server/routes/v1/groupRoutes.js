import express from "express";
import * as GroupC from "../../controllers/groupController.js";
import { authMiddleware } from "../../middlewares/authMiddleware.js";
import { authorizeRoles } from "../../middlewares/roleMiddleware.js";
const groupRouter = express.Router();
groupRouter.post("/", authMiddleware, GroupC.createGroup);
groupRouter.put("/:id", authMiddleware, GroupC.updateGroup);
groupRouter.delete(
  "/:id",
  authMiddleware,
  authorizeRoles("Admin"),
  GroupC.deleteGroup
);
groupRouter.post("/:id/add-member", authMiddleware, GroupC.addMember);
groupRouter.delete(
  "/:id/remove-member/:userId",
  authMiddleware,
  GroupC.removeMember
);
groupRouter.get("/:id", authMiddleware, GroupC.getGroupDetails);
groupRouter.get("/:id/fund", authMiddleware, GroupC.getGroupFund);
groupRouter.put("/:id/fund", authMiddleware, GroupC.updateGroupFund);
export default groupRouter;
