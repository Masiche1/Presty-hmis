// controllers/mpesaController.js
const crypto = require('crypto');
const config = require('../config/config');

// M-Pesa payment notification handler
exports.handlePaymentNotification = async (req, res) => {
    const paymentData = req.body;

    console.log('Received M-Pesa payment notification:', paymentData);

    // Validate the payment notification
    if (!validateMpesaNotification(paymentData)) {
        console.error('Invalid M-Pesa payment notification');
        return res.status(400).send('Invalid notification');
    }

    // Process the payment
    try {
        await processMpesaPayment(paymentData);
        res.status(200).send('Payment processed successfully');
    } catch (err) {
        console.error('Error processing M-Pesa payment:', err);
        res.status(500).send('Internal Server Error');
    }
};

// Validation function
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

// Signature generation function
function generateSignature(transactionId, amount, secretKey) {
    const data = `${transactionId}:${amount}`;
    return crypto.createHmac('sha256', secretKey).update(data).digest('hex');
}

// Payment processing function
async function processMpesaPayment(data) {
    console.log(`Processing M-Pesa payment for Transaction ID: ${data.TransactionID}`);
    // Implement your logic to update your database, notify users, etc.
    return Promise.resolve();
}
