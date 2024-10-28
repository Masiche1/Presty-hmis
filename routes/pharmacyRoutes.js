const express = require('express');
const router = express.Router();
const Pharmacy = require('../models/Pharmacy');

// Create or Update Medication
router.post('/', async (req, res) => {
    const medication = await Pharmacy.findOneAndUpdate(
        { name: req.body.name },
        req.body,
        { upsert: true, new: true }
    );
    res.status(201).json(medication);
});

// Get Medications
router.get('/', async (req, res) => {
    const medications = await Pharmacy.find();
    res.json(medications);
});

module.exports = router;
