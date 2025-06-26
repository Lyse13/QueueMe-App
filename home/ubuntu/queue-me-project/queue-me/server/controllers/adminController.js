const db = require("../models/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Service = require("../models/Service");
const Queue = require("../models/Queue");

// Helper function to verify admin role
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Access denied. Admin only.", color: "red" });
  }
};

// Get all users
exports.getAllUsers = (req, res) => {
  User.findAll((err, users) => {
    if (err) {
      console.error("Error fetching users:", err);
      return res.status(500).json({ message: "Server error", color: "red" });
    }
    res.json(users);
  });
};

// Create a new user (Admin only)
exports.createUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    User.create({ name, email, password: hashedPassword, role }, (err, result) => {
      if (err) {
        console.error("Error creating user:", err);
        return res.status(500).json({ message: "Error creating user", color: "red" });
      }
      res.status(201).json({ message: "User created successfully" });
    });
  } catch (error) {
    console.error("Error hashing password:", error);
    res.status(500).json({ message: "Server error", color: "red" });
  }
};

// Update a user (Admin only)
exports.updateUser = async (req, res) => {
  const userId = req.params.id;
  const { name, email, role, password } = req.body;
  let updateData = { name, email, role };

  if (password) {
    updateData.password = await bcrypt.hash(password, 10);
  }

  User.update(userId, updateData, (err, result) => {
    if (err) {
      console.error("Error updating user:", err);
      return res.status(500).json({ message: "Error updating user", color: "red" });
    }
    res.json({ message: "User updated successfully" });
  });
};

// Delete a user (Admin only)
exports.deleteUser = (req, res) => {
  const userId = req.params.id;
  User.delete(userId, (err, result) => {
    if (err) {
      console.error("Error deleting user:", err);
      return res.status(500).json({ message: "Error deleting user", color: "red" });
    }
    res.json({ message: "User deleted successfully" });
  });
};

// Get all services
exports.getAllServices = (req, res) => {
  Service.findAll((err, services) => {
    if (err) {
      console.error("Error fetching services:", err);
      return res.status(500).json({ message: "Server error", color: "red" });
    }
    res.json(services);
  });
};

// Create a new service
exports.createService = (req, res) => {
  const { name, description, estimatedTime, isActive } = req.body;
  Service.create({ name, description, estimatedTime, isActive }, (err, result) => {
    if (err) {
      console.error("Error creating service:", err);
      return res.status(500).json({ message: "Error creating service", color: "red" });
    }
    res.status(201).json({ message: "Service created successfully" });
  });
};

// Update a service
exports.updateService = (req, res) => {
  const serviceId = req.params.id;
  const { name, description, estimatedTime, isActive } = req.body;
  Service.update(serviceId, { name, description, estimatedTime, isActive }, (err, result) => {
    if (err) {
      console.error("Error updating service:", err);
      return res.status(500).json({ message: "Error updating service", color: "red" });
    }
    res.json({ message: "Service updated successfully" });
  });
};

// Delete a service
exports.deleteService = (req, res) => {
  const serviceId = req.params.id;
  Service.delete(serviceId, (err, result) => {
    if (err) {
      console.error("Error deleting service:", err);
      return res.status(500).json({ message: "Error deleting service", color: "red" });
    }
    res.json({ message: "Service deleted successfully" });
  });
};

// Get all queues (for monitoring)
exports.getAllQueues = (req, res) => {
  Queue.findAll((err, queues) => {
    if (err) {
      console.error("Error fetching queues:", err);
      return res.status(500).json({ message: "Server error", color: "red" });
    }
    res.json(queues);
  });
};

// Get system statistics
exports.getSystemStats = (req, res) => {
  // This is a simplified example. In a real app, you'd query the DB for these.
  const stats = {
    totalUsers: 100, // Placeholder
    activeQueues: 5, // Placeholder
    totalServices: 10, // Placeholder
    todayServed: 250, // Placeholder
    uptime: "99.9%", // Placeholder
    responseTime: "120ms", // Placeholder
    activeSessions: 45, // Placeholder
    avgWaitTime: 12, // Placeholder
    peakHours: "10:00 AM - 2:00 PM", // Placeholder
    busiestService: "Registration", // Placeholder
    dailyActiveUsers: 156, // Placeholder
    newRegistrations: 23, // Placeholder
    completionRate: "94%", // Placeholder
  };
  res.json(stats);
};

// Update system settings (placeholder)
exports.updateSystemSettings = (req, res) => {
  const settings = req.body;
  console.log("Updating system settings:", settings);
  res.json({ message: "Settings updated successfully" });
};


