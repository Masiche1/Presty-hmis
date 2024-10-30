const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto'); // For signature verification
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Payment notification callback route
app.post('/payment/callback', (req, res) => {
    const paymentData = req.body;

    console.log('Received payment notification:', paymentData);

    // Validate the payment notification
    if (!validatePaymentNotification(paymentData)) {
        console.error('Invalid payment notification');
        return res.status(400).send('Invalid notification');
    }

    // Process the payment
    processPayment(paymentData)
        .then(() => {
            res.status(200).send('Payment processed successfully');
        })
        .catch(err => {
            console.error('Error processing payment:', err);
            res.status(500).send('Internal Server Error');
        });
});

// Example validation function
function validatePaymentNotification(data) {
    // Check for required fields
    if (!data || !data.orderId || !data.status || !data.signature) {
        return false;
    }

    // Verify payment status
    if (data.status !== 'completed') {
        return false; // Only process completed payments
    }

    // Verify the signature (for example, using HMAC)
    const expectedSignature = generateSignature(data.orderId, data.amount, process.env.SECRET_KEY);
    if (expectedSignature !== data.signature) {
        return false; // Signature doesn't match
    }

    // Add any additional validation checks as needed
    return true;
}

// Example signature generation function
function generateSignature(orderId, amount, secretKey) {
    const data = `${orderId}:${amount}`;
    return crypto.createHmac('sha256', secretKey).update(data).digest('hex');
}

// Example payment processing function
async function processPayment(data) {
    // Implement your logic to update your database, notify users, etc.
    console.log(`Processing payment for order ID: ${data.orderId}`);
    // Simulate a database update or other processing
    return Promise.resolve();
}

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
