const mongoose = require('mongoose');

const inpatientSchema = new mongoose.Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    admissionDate: { type: Date, default: Date.now },
    dischargeDate: Date,
    ward: { type: String, required: true },
    status: { type: String, default: 'Admitted' }
});

module.exports = mongoose.model('Inpatient', inpatientSchema);
