// models/User.js
const { DataTypes } = require("sequelize");
const { pgSequelize, sqliteSequelize } = require("../config/database");
const bcrypt = require("bcryptjs");

const userSchema = {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM("admin", "doctor", "nurse"),
    defaultValue: "nurse",
  },
  lastSync: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
};

const PgUser = pgSequelize.define("User", userSchema);
const SqliteUser = sqliteSequelize.define("User", userSchema);

// Hash password before saving
const hashPassword = async (user) => {
  if (user.changed("password")) {
    user.password = await bcrypt.hash(user.password, 10);
  }
};

PgUser.beforeCreate(hashPassword);
PgUser.beforeUpdate(hashPassword);
SqliteUser.beforeCreate(hashPassword);
SqliteUser.beforeUpdate(hashPassword);

module.exports = { PgUser, SqliteUser };
