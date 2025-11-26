import express from "express";
import * as VoteC from "../../controllers/voteController.js";
import { authMiddleware } from "../../middlewares/authMiddleware.js";
const voteRouter = express.Router();
voteRouter.post("/", authMiddleware, VoteC.createVote);
voteRouter.post("/:id/cast", authMiddleware, VoteC.castVote);
voteRouter.put("/:id/close", authMiddleware, VoteC.closeVote);
export default voteRouter;
