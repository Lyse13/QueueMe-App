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
      return res.status(500).json({ message: "Server error", color: "red" });
    }
    if (user) return res.status(400).json({ message: "Email already exists", color: "red" });

    const hashedPassword = await bcrypt.hash(password, 10);
    User.create({ name, email, password: hashedPassword, role }, (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ message: "Error creating user", color: "red" });
      }
      // Fetch the newly created user to return full info
      User.findByEmail(email, (err, newUser) => {
        if (err || !newUser) {
          return res.status(201).json({ message: "User registered, but could not fetch user info", color: "red" });
        }
        res.status(201).json({
          message: "User registered successfully",
          user: {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role
          }
        });
      });
    });
  });
};

// Login
exports.login = (req, res) => {
  const { email, password } = req.body;
  User.findByEmail(email, async (err, user) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: "Server error", color: "red" });
    }
    if (!user) return res.status(400).json({ message: "Invalid credentials", color: "red" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials", color: "red" });

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET || "yoursecret",
      { expiresIn: "1d" }
    );
    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  });
};

// Forgot Password
exports.forgotPassword = (req, res) => {
  const { email } = req.body;
  User.findByEmail(email, (err, user) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: "Server error", color: "red" });
    }
    if (!user) return res.status(404).json({ message: "User not found", color: "red" });

    const token = crypto.randomBytes(20).toString("hex");
    const expires = new Date(Date.now() + 3600000); // 1 hour
    User.updateResetToken(email, token, expires, (err) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ message: "Error setting reset token", color: "red" });
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
      return res.status(500).json({ message: "Server error", color: "red" });
    }
    if (!user) return res.status(400).json({ message: "Invalid or expired token", color: "red" });

    const hashedPassword = await bcrypt.hash(password, 10);
    User.updatePassword(user.id, hashedPassword, (err) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ message: "Error updating password", color: "red" });
      }
      res.json({ message: "Password reset successful" });
    });
  });
};
// No changes needed here. Update your frontend to use the `color` property in the response.
