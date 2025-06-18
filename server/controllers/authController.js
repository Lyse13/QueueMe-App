const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

// Register
exports.register = (req, res) => {
  const { name, email, password, role } = req.body;
  User.findByEmail(email, async (err, user) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: "Server error" });
    }
    if (user) return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    User.create({ name, email, password: hashedPassword, role }, (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ message: "Error creating user" });
      }
      res.status(201).json({ message: "User registered successfully" });
    });
  });
};

// Login
exports.login = (req, res) => {
  const { email, password } = req.body;
  User.findByEmail(email, async (err, user) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: "Server error" });
    }
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET || "yoursecret",
      { expiresIn: "1d" }
    );
    res.json({ token, role: user.role });
  });
};

// Forgot Password
exports.forgotPassword = (req, res) => {
  const { email } = req.body;
  User.findByEmail(email, (err, user) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: "Server error" });
    }
    if (!user) return res.status(404).json({ message: "User not found" });

    const token = crypto.randomBytes(20).toString("hex");
    const expires = new Date(Date.now() + 3600000); // 1 hour
    User.updateResetToken(email, token, expires, (err) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ message: "Error setting reset token" });
      }
      // Send email logic here (use nodemailer)
      res.json({ message: "Password reset email sent" });
    });
  });
};

// Reset Password
exports.resetPassword = (req, res) => {
  const { token, password } = req.body;
  User.findByResetToken(token, async (err, user) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: "Server error" });
    }
    if (!user) return res.status(400).json({ message: "Invalid or expired token" });

    const hashedPassword = await bcrypt.hash(password, 10);
    User.updatePassword(user.id, hashedPassword, (err) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ message: "Error updating password" });
      }
      res.json({ message: "Password reset successful" });
    });
  });
};
