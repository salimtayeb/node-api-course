const jwt = require("jsonwebtoken");
const config = require("../config/env");

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      error: "Token manquant ou format invalide"
    });
  }

  const token = authHeader.slice(7);

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        error: "Token expiré"
      });
    }

    return res.status(401).json({
      error: "Token invalide"
    });
  }
}

module.exports = authenticate;
