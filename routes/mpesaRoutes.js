// routes/mpesaRoute.js
const express = require('express');
const crypto = require('crypto');
const config = require('../config/config'); // Import configuration
const router = express.Router();

// M-Pesa payment notification callback route
router.post('/payment/callback', (req, res) => {
    const paymentData = req.body;

    console.log('Received M-Pesa payment notification:', paymentData);

    // Validate the payment notification
    if (!validateMpesaNotification(paymentData)) {
        console.error('Invalid M-Pesa payment notification');
        return res.status(400).send('Invalid notification');
    }

    // Process the payment
    processMpesaPayment(paymentData)
        .then(() => {
            res.status(200).send('Payment processed successfully');
        })
        .catch(err => {
            console.error('Error processing M-Pesa payment:', err);
            res.status(500).send('Internal Server Error');
        });
});

// Example validation function
function validateMpesaNotification(data) {
    // Check for required fields
    if (!data || !data.TransactionID || !data.Status || !data.Signature) {
        return false;
    }

    // Verify payment status
    if (data.Status !== 'Completed') {
        return false; // Only process completed payments
    }

    // Verify the signature (if applicable)
    const expectedSignature = generateSignature(data.TransactionID, data.Amount, config.SECRET_KEY);
    if (expectedSignature !== data.Signature) {
        return false; // Signature doesn't match
    }

    return true;
}

// Example signature generation function
function generateSignature(transactionId, amount, secretKey) {
    const data = `${transactionId}:${amount}`;
    return crypto.createHmac('sha256', secretKey).update(data).digest('hex');
}

// Example payment processing function
async function processMpesaPayment(data) {
    console.log(`Processing M-Pesa payment for Transaction ID: ${data.TransactionID}`);
    // Implement your logic to update your database, notify users, etc.
    return Promise.resolve();
}

module.exports = router;
