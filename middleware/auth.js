// middleware/auth.js
const jwt = require("jsonwebtoken");
const { SqliteUser } = require("../models/User");

const generateToken = (user) => {
  return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
};

const protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Not authorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await SqliteUser.findByPk(decoded.id);
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: "Not authorized to access this resource",
      });
    }
    next();
  };
};

module.exports = { generateToken, protect, authorize };
