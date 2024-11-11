// routes/patientRoutes.js
const express = require("express");
const router = express.Router();
const {
  createPatient,
  getPatients,
  updatePatient,
  deletePatient,
  getPatientById,
} = require("../controllers/patientController");
const { protect, authorize } = require("../middleware/auth");
const {
  patientValidationRules,
  validate,
} = require("../middleware/validation");

router.post(
  "/patients",
  protect,
  authorize("doctor", "nurse"),
  patientValidationRules(),
  validate,
  createPatient,
);

router.get("/patients", protect, getPatients);

router.get("/patients/:id", protect, getPatientById);

router.put(
  "/patients/:id",
  protect,
  authorize("doctor", "nurse"),
  patientValidationRules(),
  validate,
  updatePatient,
);

router.delete(
  "/patients/:id",
  protect,
  authorize("admin", "doctor"),
  deletePatient,
);

module.exports = router;
