import express from "express";
import * as ContractC from "../../controllers/contractController.js";
import { authMiddleware } from "../../middlewares/authMiddleware.js";
const contractRouter = express.Router();
contractRouter.post("/", authMiddleware, ContractC.createContract);
contractRouter.post("/sign/:id", authMiddleware, ContractC.signContract);
contractRouter.get("/:id", authMiddleware, ContractC.getContract);
export default contractRouter;
