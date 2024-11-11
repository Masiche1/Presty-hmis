// config/database.js
const { Sequelize, DataTypes } = require("sequelize");

// PostgreSQL connection for online usage
const onlineDB = new Sequelize(
  "postgres://username:password@host:port/database",
  {
    dialect: "postgres",
  },
);

// SQLite connection for offline usage
const offlineDB = new Sequelize({
  dialect: "sqlite",
  storage: "offline.sqlite",
});

// Check connection to PostgreSQL (online database)
async function isOnline() {
  try {
    await onlineDB.authenticate();
    console.log("Connected to PostgreSQL (online mode).");
    return true;
  } catch (error) {
    console.log("Offline mode: using SQLite.");
    return false;
  }
}

// Function to get the appropriate connection
async function getDatabaseConnection() {
  const online = await isOnline();
  return online ? onlineDB : offlineDB;
}

module.exports = { getDatabaseConnection, DataTypes };
