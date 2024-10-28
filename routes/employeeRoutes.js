const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');

// Create Employee
router.post('/', async (req, res) => {
    const newEmployee = new Employee(req.body);
    await newEmployee.save();
    res.status(201).json(newEmployee);
});

// Get Employees
router.get('/', async (req, res) => {
    const employees = await Employee.find();
    res.json(employees);
});

module.exports = router;
