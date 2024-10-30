// config/config.js
require('dotenv').config(); // Load environment variables from .env

const config = {
    PORT: process.env.PORT || 3000,
    SECRET_KEY: process.env.SECRET_KEY || 'default_secret_key',
    // Add other configurations as needed
};

module.exports = config;
