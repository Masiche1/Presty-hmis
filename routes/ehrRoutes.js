const express = require('express');
const router = express.Router();
const EHR = require('../models/EHR');

// Create or Update EHR
router.post('/', async (req, res) => {
    const ehr = await EHR.findOneAndUpdate({ patientId: req.body.patientId }, req.body, { upsert: true, new: true });
    res.status(201).json(ehr);
});

// Get EHR
router.get('/:patientId', async (req, res) => {
    const ehr = await EHR.findOne({ patientId: req.params.patientId }).populate('patientId');
    res.json(ehr);
});

module.exports = router;
