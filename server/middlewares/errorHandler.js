module.exports = (err, req, res, next) => {
  console.error("[ERROR]", err);

  const status = err.status || 500;
  const message = err.message || "Internal Server Error";

  // Unified JSON response
  return res.status(status).json({
    success: false,
    error: message,
  });
};
