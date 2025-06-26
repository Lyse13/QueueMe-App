const db = require("../models/db");
const User = require("../models/User");
const Service = require("../models/Service");
const Queue = require("../models/Queue");

// Helper function to verify staff role
const isStaff = (req, res, next) => {
  if (req.user && (req.user.role === "staff" || req.user.role === "admin")) {
    next();
  } else {
    res.status(403).json({ message: "Access denied. Staff or Admin only.", color: "red" });
  }
};

// Get queue for assigned service
exports.getAssignedServiceQueue = (req, res) => {
  // In a real application, staff would be assigned to a service
  // For now, let's assume staff manages a generic queue or the first service
  const serviceId = req.user.assignedServiceId || 1; // Placeholder: assume service ID 1

  Queue.findByServiceId(serviceId, (err, queue) => {
    if (err) {
      console.error("Error fetching queue:", err);
      return res.status(500).json({ message: "Server error", color: "red" });
    }
    res.json({ queue: queue || [] });
  });
};

// Get assigned service details
exports.getAssignedServiceDetails = (req, res) => {
  const serviceId = req.user.assignedServiceId || 1; // Placeholder
  Service.findById(serviceId, (err, service) => {
    if (err) {
      console.error("Error fetching service details:", err);
      return res.status(500).json({ message: "Server error", color: "red" });
    }
    res.json({ service });
  });
};

// Call next customer in queue
exports.callNextCustomer = (req, res) => {
  const { customerId, queueId } = req.body;
  // Logic to mark customer as being served and notify them
  // This is a placeholder. Real implementation would involve updating queue status in DB and sending notifications.
  console.log(`Calling customer ${customerId} from queue ${queueId}`);
  res.json({ message: "Customer called successfully" });
};

// Complete service for customer
exports.completeService = (req, res) => {
  const { customerId, queueId } = req.body;
  // Logic to mark customer as served and remove from active queue
  // This is a placeholder. Real implementation would involve updating queue status in DB.
  console.log(`Service completed for customer ${customerId} from queue ${queueId}`);
  res.json({ message: "Service completed successfully" });
};

// Pause/Resume queue
exports.updateQueueStatus = (req, res) => {
  const { status, serviceId } = req.body;
  // Logic to update queue status (active/paused) for a specific service
  // This is a placeholder. Real implementation would involve updating service status in DB.
  console.log(`Queue for service ${serviceId} set to ${status}`);
  res.json({ message: `Queue status updated to ${status}` });
};

// Get staff statistics
exports.getStaffStats = (req, res) => {
  // This is a simplified example. In a real app, you'd query the DB for these.
  const stats = {
    todayServed: 50, // Placeholder
    avgWaitTime: 10, // Placeholder
    rating: 4.5, // Placeholder
    ratingCount: 30, // Placeholder
    totalServed: 500, // Placeholder
    avgServiceTime: 8, // Placeholder
    daysActive: 120, // Placeholder
  };
  res.json(stats);
};

