// services/reportService.js
const { SqlitePatient } = require("../models/Patient");
const { SqliteDocument } = require("../models/PatientDocument");
const { SqliteAuditLog } = require("../models/AuditLog");
const PDFDocument = require("pdfkit");
const ExcelJS = require("exceljs");
const fs = require("fs").promises;

class ReportService {
  static async generatePatientStatistics(dateRange) {
    const stats = await SqlitePatient.findAll({
      where: {
        createdAt: {
          [Op.between]: [dateRange.start, dateRange.end],
        },
      },
      attributes: [
        "gender",
        [sequelize.fn("COUNT", "*"), "count"],
        [
          sequelize.fn(
            "AVG",
            sequelize.fn(
              "YEAR",
              sequelize.fn("AGE", sequelize.col("dateOfBirth")),
            ),
          ),
          "avgAge",
        ],
      ],
      group: ["gender"],
    });

    return stats;
  }

  static async generateActivityReport(dateRange) {
    const activities = await SqliteAuditLog.findAll({
      where: {
        timestamp: {
          [Op.between]: [dateRange.start, dateRange.end],
        },
      },
      include: [
        {
          model: SqlitePatient,
          attributes: ["firstName", "lastName"],
        },
      ],
      order: [["timestamp", "DESC"]],
    });

    return activities;
  }

  static async generatePDFReport(data, template) {
    const doc = new PDFDocument();
    const filePath = `./reports/${Date.now()}.pdf`;
    const stream = fs.createWriteStream(filePath);

    return new Promise((resolve, reject) => {
      doc.pipe(stream);

      // Add report content based on template
      switch (template) {
        case "patient-summary":
          this.generatePatientSummaryPDF(doc, data);
          break;
        case "activity-log":
          this.generateActivityLogPDF(doc, data);
          break;
        default:
          reject(new Error("Invalid template"));
      }

      doc.end();
      stream.on("finish", () => resolve(filePath));
      stream.on("error", reject);
    });
  }

  static async generateExcelReport(data, template) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Report");
    const filePath = `./reports/${Date.now()}.xlsx`;

    switch (template) {
      case "patient-statistics":
        this.generatePatientStatisticsExcel(worksheet, data);
        break;
      case "activity-summary":
        this.generateActivitySummaryExcel(worksheet, data);
        break;
      default:
        throw new Error("Invalid template");
    }

    await workbook.xlsx.writeFile(filePath);
    return filePath;
  }
}

module.exports = ReportService;
