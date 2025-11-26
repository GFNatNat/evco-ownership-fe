import express from "express";
import * as AuthC from "../../controllers/authController.js";
const authRouter = express.Router();
authRouter.post("/register", AuthC.register);
authRouter.post("/login", AuthC.login);
authRouter.post("/refresh-token", AuthC.refreshToken);
authRouter.post("/logout", AuthC.logout);
export default authRouter;
