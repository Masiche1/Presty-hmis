// services/searchService.js
const { Op } = require("sequelize");
const { SqlitePatient } = require("../models/Patient");
const { SqliteDocument } = require("../models/PatientDocument");

class SearchService {
  static async searchPatients(query) {
    const searchTerms = query.split(" ");

    const whereConditions = searchTerms.map((term) => ({
      [Op.or]: [
        { firstName: { [Op.like]: `%${term}%` } },
        { lastName: { [Op.like]: `%${term}%` } },
        { phoneNumber: { [Op.like]: `%${term}%` } },
      ],
    }));

    return SqlitePatient.findAll({
      where: {
        [Op.and]: whereConditions,
      },
      include: [
        {
          model: SqliteDocument,
          attributes: ["id", "fileName", "uploadDate"],
        },
      ],
    });
  }

  static async advancedSearch({
    ageRange,
    gender,
    dateRange,
    documentTypes,
    conditions,
  }) {
    const whereClause = {};

    if (ageRange) {
      const today = new Date();
      whereClause.dateOfBirth = {
        [Op.between]: [
          new Date(
            today.getFullYear() - ageRange.max,
            today.getMonth(),
            today.getDate(),
          ),
          new Date(
            today.getFullYear() - ageRange.min,
            today.getMonth(),
            today.getDate(),
          ),
        ],
      };
    }

    if (gender) {
      whereClause.gender = gender;
    }

    if (dateRange) {
      whereClause.createdAt = {
        [Op.between]: [dateRange.start, dateRange.end],
      };
    }

    return SqlitePatient.findAll({
      where: whereClause,
      include: [
        {
          model: SqliteDocument,
          where: documentTypes
            ? { fileType: { [Op.in]: documentTypes } }
            : undefined,
          required: false,
        },
      ],
    });
  }
}

module.exports = SearchService;
