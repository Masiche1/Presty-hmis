// middleware/validation.js
const { body, validationResult } = require("express-validator");

const patientValidationRules = () => {
  return [
    body("firstName").trim().notEmpty().withMessage("First name is required"),
    body("lastName").trim().notEmpty().withMessage("Last name is required"),
    body("dateOfBirth").isDate().withMessage("Valid date of birth is required"),
    body("gender")
      .isIn(["Male", "Female", "Other"])
      .withMessage("Gender must be Male, Female, or Other"),
    body("phoneNumber")
      .optional()
      .isMobilePhone()
      .withMessage("Invalid phone number"),
  ];
};

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = { patientValidationRules, validate };
