import winston from "winston";
import path from "path";
import DailyRotateFile from "winston-daily-rotate-file";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logDir = path.join(__dirname, "../../logs");
const errorDir = path.join(logDir, "errors");
const auditDir = path.join(logDir, "audit");

// ensure dirs
[logDir, errorDir, auditDir].forEach((d) => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

const commonFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.errors({ stack: true }),
  winston.format.printf(
    (info) =>
      `${info.timestamp} | ${info.level.toUpperCase()} | ${info.message}${
        info.stack ? "\n" + info.stack : ""
      }`
  )
);

// daily rotate for general
const transportGeneral = new DailyRotateFile({
  dirname: logDir,
  filename: "%DATE%-app.log",
  datePattern: "YYYY-MM-DD",
  maxSize: "20m",
  maxFiles: "30d",
  zippedArchive: true,
  level: "info",
});

// daily rotate for errors
const transportError = new DailyRotateFile({
  dirname: errorDir,
  filename: "%DATE%-error.log",
  datePattern: "YYYY-MM-DD",
  maxSize: "20m",
  maxFiles: "90d",
  zippedArchive: true,
  level: "error",
});

// daily rotate for audit (separate)
const transportAudit = new DailyRotateFile({
  dirname: auditDir,
  filename: "%DATE%-audit.log",
  datePattern: "YYYY-MM-DD",
  maxSize: "50m",
  maxFiles: "365d",
  zippedArchive: true,
  level: "info",
});

const logger = winston.createLogger({
  level: "info",
  format: commonFormat,
  transports: [transportGeneral, transportError, transportAudit],
});

// console in dev
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    })
  );
}

// Forward uncaught exceptions/rejections to winston
logger.exceptions = logger.exceptions || {};
logger.rejections = logger.rejections || {};

process.on("uncaughtException", (err) => {
  logger.error(`Uncaught Exception: ${err.message}`, { stack: err.stack });
  process.exit(1);
});
process.on("unhandledRejection", (reason) => {
  logger.error(`Unhandled Rejection: ${String(reason)}`);
});

// expose helper methods
export default {
  info: (msg, meta) =>
    logger.info(typeof msg === "object" ? JSON.stringify(msg) : msg, meta),
  warn: (msg, meta) =>
    logger.warn(typeof msg === "object" ? JSON.stringify(msg) : msg, meta),
  error: (msg, meta) =>
    logger.error(typeof msg === "object" ? JSON.stringify(msg) : msg, meta),
  audit: (msg, meta) =>
    logger.info(typeof msg === "object" ? JSON.stringify(msg) : msg, {
      ...meta,
      audit: true,
    }),
};
