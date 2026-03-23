const mongoose = require("mongoose");

const securityLogSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  userId: String,
  role: String,
  method: String,
  path: String,
  requiredRole: String,
  ip: String
});

module.exports = mongoose.model("SecurityLog", securityLogSchema);