// controllers/searchController.js
const SearchService = require("../services/searchService");
const { logAction } = require("../services/auditService");

const searchPatients = async (req, res) => {
  try {
    const { query } = req.query;
    const results = await SearchService.searchPatients(query);

    await logAction(req.user.id, "SEARCH", "Patient", null, { query });

    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const advancedSearch = async (req, res) => {
  try {
    const searchParams = req.body;
    const results = await SearchService.advancedSearch(searchParams);

    await logAction(
      req.user.id,
      "ADVANCED_SEARCH",
      "Patient",
      null,
      searchParams,
    );

    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { searchPatients, advancedSearch };
