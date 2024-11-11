// routes/documentRoutes.js
const express = require("express");
const router = express.Router();
const {
  uploadDocument,
  getDocuments,
} = require("../controllers/documentController");
const { protect, authorize } = require("../middleware/auth");
const { upload } = require("../services/fileService");

router.post(
  "/patients/:patientId/documents",
  protect,
  authorize("doctor", "nurse"),
  upload.single("file"),
  uploadDocument,
);

router.get("/patients/:patientId/documents", protect, getDocuments);

module.exports = router;
