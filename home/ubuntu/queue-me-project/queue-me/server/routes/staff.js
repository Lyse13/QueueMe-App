const express = require("express");
const router = express.Router();
const staffController = require("../controllers/staffController");
const authMiddleware = require("../middleware/authMiddleware");

// Staff specific routes
router.get("/queue", authMiddleware.protect, authMiddleware.authorize("staff", "admin"), staffController.getAssignedServiceQueue);
router.get("/assigned-service", authMiddleware.protect, authMiddleware.authorize("staff", "admin"), staffController.getAssignedServiceDetails);
router.post("/call-next", authMiddleware.protect, authMiddleware.authorize("staff", "admin"), staffController.callNextCustomer);
router.post("/complete-service", authMiddleware.protect, authMiddleware.authorize("staff", "admin"), staffController.completeService);
router.post("/queue-status", authMiddleware.protect, authMiddleware.authorize("staff", "admin"), staffController.updateQueueStatus);
router.get("/stats", authMiddleware.protect, authMiddleware.authorize("staff", "admin"), staffController.getStaffStats);

module.exports = router;

