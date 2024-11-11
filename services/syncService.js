// services/syncService.js
const { PgPatient, SqlitePatient } = require("../models/Patient");
const { PgDocument, SqliteDocument } = require("../models/PatientDocument");
const { PgAuditLog, SqliteAuditLog } = require("../models/AuditLog");
const { pgSequelize, sqliteSequelize } = require("../config/database");

class ConflictResolver {
  static async resolvePatientConflict(localPatient, remotePatient) {
    if (localPatient.lastModified > remotePatient.lastModified) {
      return localPatient;
    }
    return remotePatient;
  }

  static async resolveDocumentConflict(localDoc, remoteDoc) {
    return localDoc.version > remoteDoc.version ? localDoc : remoteDoc;
  }
}

const batchSync = async (batchSize = 50) => {
  const transaction = await sqliteSequelize.transaction();

  try {
    // Sync patients
    const pendingPatients = await SqlitePatient.findAll({
      where: { syncStatus: "pending" },
      limit: batchSize,
      transaction,
    });

    for (const patient of pendingPatients) {
      const remotePatient = await PgPatient.findByPk(patient.id);

      if (remotePatient) {
        const resolvedPatient = await ConflictResolver.resolvePatientConflict(
          patient,
          remotePatient,
        );
        await PgPatient.upsert(resolvedPatient.toJSON());
      } else {
        await PgPatient.create(patient.toJSON());
      }

      await patient.update({ syncStatus: "synced" }, { transaction });
    }

    // Sync documents
    const pendingDocs = await SqliteDocument.findAll({
      where: { syncStatus: "pending" },
      limit: batchSize,
      transaction,
    });

    for (const doc of pendingDocs) {
      const remoteDoc = await PgDocument.findByPk(doc.id);

      if (remoteDoc) {
        const resolvedDoc = await ConflictResolver.resolveDocumentConflict(
          doc,
          remoteDoc,
        );
        await PgDocument.upsert(resolvedDoc.toJSON());
      } else {
        await PgDocument.create(doc.toJSON());
      }

      await doc.update({ syncStatus: "synced" }, { transaction });
    }

    // Sync audit logs
    const pendingLogs = await SqliteAuditLog.findAll({
      where: { syncStatus: "pending" },
      limit: batchSize,
      transaction,
    });

    for (const log of pendingLogs) {
      await PgAuditLog.create(log.toJSON());
      await log.update({ syncStatus: "synced" }, { transaction });
    }

    await transaction.commit();
    return true;
  } catch (error) {
    await transaction.rollback();
    console.error("Batch sync error:", error);
    return false;
  }
};

module.exports = { batchSync };
