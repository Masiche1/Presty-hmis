// controllers/documentController.js
const { SqliteDocument } = require("../models/PatientDocument");
const { upload } = require("../services/fileService");
const { logAction } = require("../services/auditService");
const { batchSync } = require("../services/syncService");

const uploadDocument = async (req, res) => {
  try {
    const { patientId } = req.params;

    const document = await SqliteDocument.create({
      patientId,
      fileName: req.file.originalname,
      fileType: req.file.mimetype,
      filePath: req.file.path,
      uploadedBy: req.user.id,
    });

    await logAction(req.user.id, "UPLOAD", "PatientDocument", document.id, {
      fileName: req.file.originalname,
    });

    try {
      await batchSync();
    } catch (syncError) {
      console.log("Sync failed, will try later");
    }

    res.status(201).json(document);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getDocuments = async (req, res) => {
  try {
    const { patientId } = req.params;
    const documents = await SqliteDocument.findAll({
      where: { patientId },
    });
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { uploadDocument, getDocuments };
