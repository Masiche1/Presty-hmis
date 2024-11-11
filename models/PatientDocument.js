// models/PatientDocument.js
const { DataTypes } = require("sequelize");
const { pgSequelize, sqliteSequelize } = require("../config/database");

const documentSchema = {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  patientId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  fileName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fileType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  filePath: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  uploadedBy: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  uploadDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  syncStatus: {
    type: DataTypes.ENUM("pending", "synced"),
    defaultValue: "pending",
  },
  version: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
};

const PgDocument = pgSequelize.define("PatientDocument", documentSchema);
const SqliteDocument = sqliteSequelize.define(
  "PatientDocument",
  documentSchema,
);

module.exports = { PgDocument, SqliteDocument };
