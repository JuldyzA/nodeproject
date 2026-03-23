const SecurityLog = require("../models/log");

function getBestEffortIp(req) {
  const forwardedFor = req.headers["x-forwarded-for"];
  const forwardedIp = typeof forwardedFor === "string"
    ? forwardedFor.split(",")[0].trim()
    : null;

  return req.ip || forwardedIp || req.socket?.remoteAddress || null;
}

async function logUnauthorizedAccess(req, requiredRole) {
  try {
    await SecurityLog.create({
      timestamp: new Date(),
      userId: req.user ? String(req.user._id) : null,
      role: req.user ? req.user.role : "GUEST",
      method: req.method,
      path: req.originalUrl,
      requiredRole: Array.isArray(requiredRole)
        ? requiredRole.join(" or ")
        : requiredRole,
      ip: getBestEffortIp(req)
    });
  } catch (err) {
    console.error("Logging failed:", err);
  }
}

async function getRecentUnauthorizedAccess(limit = 10) {
  return SecurityLog.find()
    .sort({ timestamp: -1 })
    .limit(limit)
    .lean();
}

module.exports = {
  logUnauthorizedAccess,
  getRecentUnauthorizedAccess
};
