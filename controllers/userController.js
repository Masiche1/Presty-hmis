// controllers/userController.js
const User = require('../models/userModel');

// Create a new user
exports.createUser = async (req, res) => {
    const { username, password } = req.body;
    // Implement password hashing here

    try {
        const newUser = new User({ username, password });
        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all users
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find().populate('groups');
        res.status(200).json(users);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
