import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import bodyParser from "body-parser";
import { errorHandler } from "./middlewares/errorHandler.js";
import { requestLogger } from "./middlewares/requestLogger.js";
import apiV1Routes from "./routes/v1/index.js";

const app = express();

// Security middlewares
app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(morgan("dev"));
app.use(cookieParser());
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true }));

// Rate limiter
app.use("/api/", rateLimit({ windowMs: 15 * 60 * 1000, max: 300 }));

app.use(requestLogger);

// API Versioning
app.use("/api/v1", apiV1Routes);

// Global Error Handler
app.use(errorHandler);

export default app;
