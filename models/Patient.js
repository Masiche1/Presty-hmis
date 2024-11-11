// models/patient.js
const { DataTypes } = require("sequelize");
const { getDatabaseConnection } = require("../config/database");

async function definePatientModel(connection) {
    const Patient = connection.define("Patient", {
        patientId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isEmail: true,
            },
        },
        phone: {
            type: DataTypes.STRING,
        },
        admissionDate: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        dischargeDate: {
            type: DataTypes.DATE,
        },
        ward: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        diagnosis: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        status: {
            type: DataTypes.STRING,
            defaultValue: "Admitted",
        },
    });

    await Patient.sync(); // Sync model with the database
    return Patient;
}

async function getPatientModel() {
    const connection = await getDatabaseConnection();
    return definePatientModel(connection);
}

module.exports = { getPatientModel };
