const config = require("../config/env");

function notFound(req, res, next) {
  res.status(404).json({
    error: `Route introuvable : ${req.method} ${req.path}`
  });
}

function errorHandler(err, req, res, next) {
  const status = err.status || err.statusCode || 500;

  const logEntry = {
    timestamp: new Date().toISOString(),
    method: req.method,
    path: req.path,
    status,
    message: err.message
  };

  console.error("[ERROR]", JSON.stringify(logEntry));

  if (config.nodeEnv === "production" && status >= 500) {
    return res.status(500).json({
      error: "Erreur interne"
    });
  }

  return res.status(status).json({
    error: err.message || "Erreur interne"
  });
}

module.exports = {
  notFound,
  errorHandler
};
