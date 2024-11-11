// models/AuditLog.js
const { DataTypes } = require("sequelize");
const { pgSequelize, sqliteSequelize } = require("../config/database");

const auditSchema = {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  action: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  resourceType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  resourceId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  details: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  syncStatus: {
    type: DataTypes.ENUM("pending", "synced"),
    defaultValue: "pending",
  },
};

const PgAuditLog = pgSequelize.define("AuditLog", auditSchema);
const SqliteAuditLog = sqliteSequelize.define("AuditLog", auditSchema);

module.exports = { PgAuditLog, SqliteAuditLog };
