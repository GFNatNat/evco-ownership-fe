import logger from "../utils/logger.js";

export const errorHandler = (err, req, res, next) => {
  const status = err.statusCode || 500;
  const payload = {
    message: err.message,
    status,
    route: req.originalUrl,
    method: req.method,
    user: req.user?.id || "anon",
    timestamp: new Date().toISOString(),
    stack: err.stack,
  };

  // log to error file (transportError) via logger.error
  logger.error(
    `ERROR ${payload.method} ${payload.route} user=${payload.user} msg=${payload.message}`,
    payload
  );

  // also log a condensed audit entry
  logger.audit(
    `AUDIT_ERROR user=${payload.user} route=${payload.route} msg=${payload.message}`,
    {
      level: "audit",
      error: true,
    }
  );

  res.status(status).json({
    success: false,
    message: err.safeMessage || err.message || "Internal Server Error",
  });
};
