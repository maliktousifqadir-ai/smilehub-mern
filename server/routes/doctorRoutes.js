const express = require("express");

const {
  addDoctor,
  getDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
} = require("../controllers/doctorController");

const { protect } = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

// ==========================================
// Public Routes
// ==========================================

// Get All Doctors
router.get("/", getDoctors);

// Get Single Doctor
router.get("/:id", getDoctorById);


// ==========================================
// Admin Only Routes
// ==========================================

// Add Doctor
router.post(
  "/",
  protect,
  adminMiddleware,
  addDoctor
);

// Update Doctor
router.put(
  "/:id",
  protect,
  adminMiddleware,
  updateDoctor
);

// Delete Doctor
router.delete(
  "/:id",
  protect,
  adminMiddleware,
  deleteDoctor
);

module.exports = router;