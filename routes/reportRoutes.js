// routes/reportRoutes.js
const express = require("express");
const router = express.Router();
const { generateReport } = require("../controllers/reportController");
const { protect, authorize } = require("../middleware/auth");

router.post("/reports", protect, authorize("admin", "doctor"), generateReport);

module.exports = router;
