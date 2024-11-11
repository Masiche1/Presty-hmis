// controllers/userController.js
const { SqliteUser } = require("../models/User");
const { generateToken } = require("../middleware/auth");
const bcrypt = require("bcryptjs");

const register = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    const userExists = await SqliteUser.findOne({ where: { username } });
    if (userExists) {
      return res.status(400).json({ error: "Username already exists" });
    }

    const user = await SqliteUser.create({
      username,
      password,
      role,
    });

    const token = generateToken(user);
    res.status(201).json({
      id: user.id,
      username: user.username,
      role: user.role,
      token,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await SqliteUser.findOne({ where: { username } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = generateToken(user);
    res.json({
      id: user.id,
      username: user.username,
      role: user.role,
      token,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { register, login };
