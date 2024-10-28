const express = require('express');
const router = express.Router();
const Inpatient = require('../models/Inpatient');

// Admit Patient
router.post('/', async (req, res) => {
    const newInpatient = new Inpatient(req.body);
    await newInpatient.save();
    res.status(201).json(newInpatient);
});

// Get Inpatients
router.get('/', async (req, res) => {
    const inpatients = await Inpatient.find().populate('patientId');
    res.json(inpatients);
});

// Discharge Patient
router.put('/:id', async (req, res) => {
    const updatedInpatient = await Inpatient.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedInpatient);
});

module.exports = router;
