const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.protect = (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token", color: "red" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "yoursecret");
    User.findById(decoded.userId, (err, user) => {
      if (err || !user) {
        return res.status(401).json({ message: "Not authorized, user not found", color: "red" });
      }
      req.user = user;
      next();
    });
  } catch (error) {
    res.status(401).json({ message: "Not authorized, token failed", color: "red" });
  }
};

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: `User role ${req.user.role} is not authorized to access this route`, color: "red" });
    }
    next();
  };
};

