// Enhanced patientController.js
const { SqlitePatient } = require("../models/Patient");
const { syncData } = require("../services/syncService");

const updatePatient = async (req, res) => {
  try {
    const patient = await SqlitePatient.findByPk(req.params.id);
    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    await patient.update(req.body);

    try {
      await syncData();
    } catch (syncError) {
      console.log("Sync failed, will try later");
    }

    res.json(patient);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deletePatient = async (req, res) => {
  try {
    const patient = await SqlitePatient.findByPk(req.params.id);
    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    await patient.destroy();

    try {
      await syncData();
    } catch (syncError) {
      console.log("Sync failed, will try later");
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getPatientById = async (req, res) => {
  try {
    const patient = await SqlitePatient.findByPk(req.params.id);
    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }
    res.json(patient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
