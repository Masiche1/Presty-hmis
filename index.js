// Updated server.js
const express = require("express");
const cors = require("cors");
const db = require("./config/database");
const morgan = require("morgan");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const sqlite3 = require("sqlite3");
const { Pool } = require("pg");
const { testConnections } = require("./config/database");
const patientRoutes = require("./routes/patientRoutes");
const userRoutes = require("./routes/userRoutes");
const documentRoutes = require("./routes/documentRoutes");
const errorHandler = require("./middleware/errorHandler");
const consultationRoutes = require("./routes/consultationRoutes");
const knex = require("knex");
const dbConfig = require("./config/database");
const { Sequelize, DataTypes } = require("sequelize");
require("dotenv").config();

// Security middleware const db = knex(dbConfig);
app.use(helmet());
app.use(express.json());
app.use(morgan("dev"));
app.use(cors()); // Enable CORS
app.use(bodyParser.json()); // Parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));

// Routes

app.use("/api", userRoutes);
app.use("/api", patientRoutes);
app.use("/api", documentRoutes);
app.use(errorHandler);
app.use(phiErrorHandler);
app.use(validationErrorHandler);
app.use(databaseErrorHandler);
app.use(hipaaErrorHandler);
app.use(rateLimitErrorHandler);
app.use("/api/consultations", consultationRoutes);

// Always add the final error handler last
app.use(finalErrorHandler);

// Initialize Knex with the appropriate config

// Use `db` to interact with the database (SQLite or PostgreSQL)
db("users")
  .select("*")
  .then((users) => {
    console.log(users);
  })
  .catch((err) => {
    console.error("Database error:", err);
  });

async function initializeDatabase() {
  // Your async function
  await db.query(createConsultationsTable);
  // ... rest of your database setup ...
}
// ... other code in your module ...
initializeDatabase(); // Call your async function

// Example usage in your application

async function myFunction() {
  // ... your code ...
  const isConnected = await db.testConnections();
  if (isConnected) {
    console.log("Database connections are working!");
  } else {
    console.error("At least one database connection failed!");
  }
  // ... more code ...
}

// Call the function to test the database connection
async function checkDatabase() {
  const isConnected = await testConnections();
  if (isConnected) {
    console.log("Connection is working!");
  } else {
    console.log("Connection failed!");
  }
}

checkDatabase();

const { getPatientModel } = require("./models/Patient");

async function createPatient(patientData) {
  try {
    const Patient = await getPatientModel(); // Get the Patient model based on connection status
    const patient = await Patient.create(patientData);
    console.log("Patient created:", patient);
    return patient;
  } catch (error) {
    console.error("Error creating patient:", error);
  }
}

async function fetchPatients() {
  try {
    const Patient = await getPatientModel();
    const patients = await Patient.findAll();
    console.log("Patients:", patients);
    return patients;
  } catch (error) {
    console.error("Error fetching patients:", error);
  }
}

// Example usage
createPatient({
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "123-456-7890",
  ward: "A1",
  diagnosis: "Flu",
  status: "Admitted",
});

fetchPatients();

// Serve uploaded files
app.use("/uploads", protect, express.static("uploads"));
const app = express();

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use("/api/", limiter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Something went wrong!",
    message: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// Test database connections on startup
testConnections();

async function setupAndRun() {
  // Create an async function
  await setupOfflineSupport(); // Use await inside the function
  // ... rest of your code ...
}

// Add offline sync middleware
app.use(offlineSyncMiddleware);

// Use offline-aware consultation model in your routes
app.post("/api/consultations", async (req, res) => {
  const consultation = await OfflineConsultation.create(req.body);
  res.json({
    data: consultation,
    syncStatus: global.syncManager.isOnline ? "synced" : "pending",
  });
});

const ConsultationModel = class extends SyncableModel {
  static tableName = "consultations";

  // ... other methods
};

app.post("/api/consultations", async (req, res) => {
  const consultation = await ConsultationModel.createWithSync({
    ...req.body,
    created_by: req.user.id,
  });

  res.json({
    data: consultation,
    syncStatus: global.syncManager.isOnline ? "synced" : "pending",
    batchId: consultation.batch_id,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
