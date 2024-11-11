const mongoose = require('mongoose');

const billingSchema = new mongoose.Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    amount: { type: Number, required: true },
    paymentStatus: { type: String, default: 'Pending' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Billing', billingSchema);
