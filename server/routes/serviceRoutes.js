const express = require("express");

const {
  addService,
  getServices,
  getServiceById,
} = require("../controllers/serviceController");

const { protect } = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

// Public Routes
router.get("/", getServices);
router.get("/:id", getServiceById);

// Admin Only Route
router.post("/", protect, adminMiddleware, addService);

module.exports = router;