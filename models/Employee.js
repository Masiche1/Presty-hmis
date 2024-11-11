const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    position: { type: String, required: true },
    salary: { type: Number, required: true },
    dateHired: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Employee', employeeSchema);
