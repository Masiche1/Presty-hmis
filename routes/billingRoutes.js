const express = require('express');
const router = express.Router();
const Billing = require('../models/Billing');

// Create Invoice
router.post('/', async (req, res) => {
    const newBilling = new Billing(req.body);
    await newBilling.save();
    res.status(201).json(newBilling);
});

// Get Invoices
router.get('/', async (req, res) => {
    const bills = await Billing.find().populate('patientId');
    res.json(bills);
});

// Update Payment Status
router.put('/:id', async (req, res) => {
    const updatedBilling = await Billing.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedBilling);
});

module.exports = router;

//Initiate m-pesa payment
const mpesaService = require('../services/mpesaService');

router.post('/payment', async (req, res) => {
    const { phoneNumber, amount } = req.body;
    try {
        const paymentResponse = await mpesaService.initiatePayment(phoneNumber, amount);
        res.json(paymentResponse.data);
    } catch (error) {
        res.status(500).send(error.message);
    }
});
