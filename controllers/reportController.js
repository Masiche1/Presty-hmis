// controllers/reportController.js
const ReportService = require("../services/reportService");
const { logAction } = require("../services/auditService");

const generateReport = async (req, res) => {
  try {
    const { type, format, dateRange } = req.body;
    let report;

    switch (format) {
      case "pdf":
        report = await ReportService.generatePDFReport(
          await ReportService.generatePatientStatistics(dateRange),
          type,
        );
        break;
      case "excel":
        report = await ReportService.generateExcelReport(
          await ReportService.generateActivityReport(dateRange),
          type,
        );
        break;
      default:
        throw new Error("Unsupported format");
    }

    await logAction(req.user.id, "GENERATE_REPORT", "Report", null, {
      type,
      format,
      dateRange,
    });

    res.json({ reportUrl: `/reports/${report}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { generateReport };
