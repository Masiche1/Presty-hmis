// models/group.js
const mongoose = require('mongoose');

// Define the Group schema
const groupSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true, 
        unique: true 
    },
    members: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' // Reference to the User model
    }],
}, {
    timestamps: true, // Automatically manage createdAt and updatedAt timestamps
});

// Export the Group model
module.exports = mongoose.model('Group', groupSchema);

