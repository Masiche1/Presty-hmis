const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// Import Routes
const userRoutes = require('./routes/userRoutes');
const patientRoutes = require('./routes/patientRoutes');
// ...other routes

app.use('/api/users', userRoutes);
app.use('/api/patients', patientRoutes);
// ...other route handlers

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
