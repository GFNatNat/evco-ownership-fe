import express from "express";
import * as UserC from "../../controllers/userController.js";
import { upload } from "../../middlewares/uploadMiddleware.js";
import { authMiddleware } from "./../../middlewares/authMiddleware.js";
const userRouter = express.Router();
userRouter.get("/me", authMiddleware, UserC.getProfile);
userRouter.put("/me", authMiddleware, UserC.updateProfile);
userRouter.post(
  "/me/upload-license",
  authMiddleware,
  upload.single("license"),
  UserC.uploadDriverLicense
);
export default userRouter;
