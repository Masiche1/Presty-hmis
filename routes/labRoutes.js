const express = require('express');
const router = express.Router();
const LabTest = require('../models/LabTest');

// Create Lab Test
router.post('/', async (req, res) => {
    const newTest = new LabTest(req.body);
    await newTest.save();
    res.status(201).json(newTest);
});

// Get Lab Tests
router.get('/', async (req, res) => {
    const tests = await LabTest.find().populate('patientId');
    res.json(tests);
});

// Update Lab Test Results
router.put('/:id', async (req, res) => {
    const updatedTest = await LabTest.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedTest);
});

module.exports = router;
