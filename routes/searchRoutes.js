// routes/searchRoutes.js
const express = require("express");
const router = express.Router();
const {
  searchPatients,
  advancedSearch,
} = require("../controllers/searchController");
const { protect } = require("../middleware/auth");

router.get("/search", protect, searchPatients);
router.post("/search/advanced", protect, advancedSearch);

module.exports = router;
