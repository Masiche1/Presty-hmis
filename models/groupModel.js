// models/groupModel.js
const mongoose = require('mongoose');

// Define the Group schema
const groupSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true, 
        unique: true 
    },
    users: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' // Reference to the User model
    }],
    permissions: [{ 
        type: mongoose.Schema.Types.ObjectId, ref: 'Permission' }],
    },
                                       
    {
    timestamps: true, // Automatically manage createdAt and updatedAt timestamps
});

// Export the Group model
module.exports = mongoose.model('Group', groupSchema);

