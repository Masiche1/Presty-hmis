// Importing required packages
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoute = require('./routes/userRoute');
const groupRoute = require('./routes/groupRoute');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Importing routes
const patientRoutes = require('./routes/patientRoutes');
const billingRoutes = require('./routes/billingRoutes');
const labRoutes = require('./routes/labRoutes');
const pharmacyRoutes = require('./routes/pharmacyRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const priceListRoutes = require('./routes/priceListRoutes');
const mpesaRoutes = require('./routes/mpesaRoutes');
const userRoutes = require('./routes/serRoutes');
const groupRoutes = require('./routes/groupRoutes');
const ehrRoutes = require('./routes/ehrRoutes');
const paymentNotificationCallbackRoutes = require('./routes/paymentNotificationCallbackRoutes');
const inpatientRoutes = require('./routes/inpatientRoutes');
// Setting up the Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Enable CORS
app.use(bodyParser.json()); // Parse JSON bodies

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/patients', patientRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/lab', labRoutes);
app.use('/api/pharmacy', pharmacyRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/price-list', priceListRoutes);
app.use('/api/mpesa', mpesaRoutes);
app.use('/api', userRoute);
app.use('/api', groupRoute);
app.use('/api', inpatientRoute);
app.use('/api', ehrRoute);
app.use('/api', paymentNotifiationCallbackRoute);
// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
