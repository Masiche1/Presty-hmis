const { ValidationError } = require("express-validator");
const logger = require("./logger"); // Assume you have a logging setup

// Custom error class for HMIS-specific errors
class HMISError extends Error {
  constructor(message, statusCode = 500, operational = true) {
    super(message);
    this.statusCode = statusCode;
    this.operational = operational;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Error handler for invalid PHI (Protected Health Information) access
const phiErrorHandler = (err, req, res, next) => {
  if (err.name === "UnauthorizedPHIAccess") {
    logger.error("PHI Access Violation", {
      userId: req.user?.id,
      attemptedResource: req.originalUrl,
      timestamp: new Date().toISOString(),
    });

    return res.status(403).json({
      status: "error",
      message: "Unauthorized access to protected health information",
      errorCode: "PHI_ACCESS_DENIED",
    });
  }
  next(err);
};

// Validation error handler
const validationErrorHandler = (err, req, res, next) => {
  if (err instanceof ValidationError) {
    return res.status(400).json({
      status: "error",
      message: "Input validation failed",
      errors: err.array(),
    });
  }
  next(err);
};

// Database error handler
const databaseErrorHandler = (err, req, res, next) => {
  if (err.name === "SequelizeError" || err.name === "MongoError") {
    logger.error("Database Error", {
      error: err.message,
      query: err.sql, // For SQL databases
      collection: err.collection, // For MongoDB
      timestamp: new Date().toISOString(),
    });

    return res.status(503).json({
      status: "error",
      message: "Database operation failed",
      errorCode: "DB_ERROR",
    });
  }
  next(err);
};

// HIPAA compliance error handler
const hipaaErrorHandler = (err, req, res, next) => {
  if (err.name === "HIPAAViolation") {
    logger.error("HIPAA Compliance Violation", {
      violation: err.message,
      userId: req.user?.id,
      timestamp: new Date().toISOString(),
    });

    return res.status(400).json({
      status: "error",
      message: "HIPAA compliance violation detected",
      errorCode: "HIPAA_VIOLATION",
    });
  }
  next(err);
};

// Final error handler
const finalErrorHandler = (err, req, res, next) => {
  logger.error("Unhandled Error", {
    error: err.message,
    stack: err.stack,
    timestamp: new Date().toISOString(),
  });

  // Don't expose error details in production
  const message =
    process.env.NODE_ENV === "production"
      ? "An unexpected error occurred"
      : err.message;

  res.status(err.statusCode || 500).json({
    status: "error",
    message,
    errorCode: "INTERNAL_SERVER_ERROR",
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
};

// Rate limiting error handler
const rateLimitErrorHandler = (err, req, res, next) => {
  if (err.name === "RateLimitExceeded") {
    logger.warn("Rate Limit Exceeded", {
      userId: req.user?.id,
      ip: req.ip,
      timestamp: new Date().toISOString(),
    });

    return res.status(429).json({
      status: "error",
      message: "Too many requests, please try again later",
      errorCode: "RATE_LIMIT_EXCEEDED",
    });
  }
  next(err);
};

// Export error handlers
module.exports = {
  HMISError,
  phiErrorHandler,
  validationErrorHandler,
  databaseErrorHandler,
  hipaaErrorHandler,
  rateLimitErrorHandler,
  finalErrorHandler,
};
