import express from "express";
import * as ReportC from "../../controllers/reportController.js";
import { authMiddleware } from "../../middlewares/authMiddleware.js";
const reportRouter = express.Router();
reportRouter.get("/financial", authMiddleware, ReportC.generateFinancialReport);
reportRouter.get("/usage", authMiddleware, ReportC.generateUsageReport);
export default reportRouter;
