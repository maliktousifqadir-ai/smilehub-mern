const express = require("express");

const {
  createAppointment,
  getAppointments,
  cancelAppointment,
  rescheduleAppointment,
  getAllAppointments,
  updateAppointmentStatus,
} = require("../controllers/appointmentController");

const { protect } = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

const router = express.Router();

// ==========================================
// User Appointment Routes
// ==========================================

// Create Appointment
router.post(
  "/",
  protect,
  createAppointment
);

// Get Logged-in User Appointments
router.get(
  "/",
  protect,
  getAppointments
);

// ==========================================
// Admin Appointment Routes
// ==========================================

// Get All Appointments
router.get(
  "/admin/all",
  protect,
  admin,
  getAllAppointments
);

// Update Appointment Status
router.patch(
  "/admin/:id/status",
  protect,
  admin,
  updateAppointmentStatus
);

// ==========================================
// User Appointment Actions
// ==========================================

// Cancel Appointment
router.patch(
  "/:id",
  protect,
  cancelAppointment
);

// Reschedule Appointment
router.put(
  "/:id/reschedule",
  protect,
  rescheduleAppointment
);

module.exports = router;