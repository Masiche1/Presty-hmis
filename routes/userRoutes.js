const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Create User
router.post('/', async (req, res) => {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json(newUser);
});

// Get Users
router.get('/', async (req, res) => {
    const users = await User.find();
    res.json(users);
});

module.exports = router;
