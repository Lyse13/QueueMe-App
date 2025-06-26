const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const authMiddleware = require("../middleware/authMiddleware");

// Admin specific routes
router.get("/users", authMiddleware.protect, authMiddleware.authorize("admin"), adminController.getAllUsers);
router.post("/users", authMiddleware.protect, authMiddleware.authorize("admin"), adminController.createUser);
router.put("/users/:id", authMiddleware.protect, authMiddleware.authorize("admin"), adminController.updateUser);
router.delete("/users/:id", authMiddleware.protect, authMiddleware.authorize("admin"), adminController.deleteUser);

router.get("/services", authMiddleware.protect, authMiddleware.authorize("admin"), adminController.getAllServices);
router.post("/services", authMiddleware.protect, authMiddleware.authorize("admin"), adminController.createService);
router.put("/services/:id", authMiddleware.protect, authMiddleware.authorize("admin"), adminController.updateService);
router.delete("/services/:id", authMiddleware.protect, authMiddleware.authorize("admin"), adminController.deleteService);

router.get("/queues", authMiddleware.protect, authMiddleware.authorize("admin"), adminController.getAllQueues);
router.get("/stats", authMiddleware.protect, authMiddleware.authorize("admin"), adminController.getSystemStats);
router.post("/settings", authMiddleware.protect, authMiddleware.authorize("admin"), adminController.updateSystemSettings);

module.exports = router;

