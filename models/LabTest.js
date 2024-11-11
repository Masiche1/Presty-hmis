const mongoose = require('mongoose');

const labTestSchema = new mongoose.Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    testName: { type: String, required: true },
    sampleDate: { type: Date, default: Date.now },
    results: String,
    status: { type: String, default: 'Pending' }
});

module.exports = mongoose.model('LabTest', labTestSchema);
