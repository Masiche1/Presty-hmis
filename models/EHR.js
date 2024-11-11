const mongoose = require('mongoose');

const ehrSchema = new mongoose.Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    medicalHistory: { type: String },
    medications: [{ name: String, dosage: String }],
    followUpDate: Date
});

module.exports = mongoose.model('EHR', ehrSchema);
