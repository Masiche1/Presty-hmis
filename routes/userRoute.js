// routes/userRoute.js
const express = require('express');
const { createUser, getUsers, loginUser } = require('../controllers/userController');
const User = require('../models/userModel');
const router = express.Router();

router.post('/users', createUser);
router.get('/users', getUsers);
router.post('/login', loginUser);

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

// User login
exports.loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Compare the hashed password with the password provided
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // If successful, return user data without the password
        user.password = undefined; // Optionally omit password
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = router;
