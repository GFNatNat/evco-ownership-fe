import express from "express";
import * as CostC from "../../controllers/costController.js";
import { authMiddleware } from "../../middlewares/authMiddleware.js";
const costRouter = express.Router();
costRouter.post("/add", authMiddleware, CostC.addCost);
costRouter.post("/settle/:id", authMiddleware, CostC.settleExpense);
costRouter.get("/history", authMiddleware, CostC.getCostHistory);
costRouter.get("/outstanding", authMiddleware, CostC.getOutstanding);
export default costRouter;
