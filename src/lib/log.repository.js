const SecurityLog = require("../models/log");

async function logUnauthorizedAccess(req, requiredRole) {
  try {
    await SecurityLog.create({
      timestamp: new Date(),
      userId: req.user ? String(req.user._id) : null,
      role: req.user ? req.user.role : "Guest",
      method: req.method,
      path: req.originalUrl,
      requiredRole: Array.isArray(requiredRole)
        ? requiredRole.join(" or ")
        : requiredRole,
        ip: req.ip || req.headers["x-forwarded-for"] || req.socket?.remoteAddress || null
    });
  } catch (err) {
    console.error("Logging failed:", err);
  }
}

module.exports = {
    logUnauthorizedAccess
}