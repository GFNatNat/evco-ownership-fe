import logger from "../utils/logger.js";

export const requestLogger = (req, res, next) => {
  const start = process.hrtime.bigint();
  const { method, originalUrl } = req;
  const userId = req.user?.id || req.headers["x-user-id"] || "anon";

  // capture request body/params but avoid logging huge bodies (truncate)
  const safeBody = (() => {
    try {
      const b = req.body;
      if (!b) return null;
      const s = JSON.stringify(b);
      return s.length > 2000 ? s.slice(0, 2000) + "...TRUNC" : s;
    } catch {
      return "unserializable";
    }
  })();

  res.on("finish", () => {
    const end = process.hrtime.bigint();
    const durationMs = Number(end - start) / 1e6;
    const message = `${method} ${originalUrl} ${
      res.statusCode
    } ${durationMs.toFixed(2)}ms user=${userId}`;
    const meta = {
      ip: req.ip,
      params: req.params,
      query: req.query,
      body: safeBody,
    };
    logger.info(message, meta);
  });

  next();
};
