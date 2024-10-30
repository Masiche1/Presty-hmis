// controllers/groupController.js
const Group = require('../models/groupModel');

// Create a new group
exports.createGroup = async (req, res) => {
    const { name } = req.body;

    try {
        const newGroup = new Group({ name });
        await newGroup.save();
        res.status(201).json(newGroup);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all groups
exports.getGroups = async (req, res) => {
    try {
        const groups = await Group.find().populate('members');
        res.status(200).json(groups);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
