// services/auditService.js
const { SqliteAuditLog } = require("../models/AuditLog");

const logAction = async (
  userId,
  action,
  resourceType,
  resourceId,
  details = {},
) => {
  try {
    await SqliteAuditLog.create({
      userId,
      action,
      resourceType,
      resourceId,
      details,
    });
  } catch (error) {
    console.error("Audit logging failed:", error);
  }
};

module.exports = { logAction };
