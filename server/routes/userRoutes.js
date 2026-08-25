const express = require("express");

const {
  registerUser,
  loginUser,
  verifyOTP,
  getUserProfile,
  updateUserProfile,
} = require("../controllers/userController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// =======================
// Public Routes
// =======================

// Register User
router.post("/register", registerUser);

// Login User
router.post("/login", loginUser);

// Verify Email OTP
router.post("/verify-otp", verifyOTP);

// =======================
// Protected Routes
// =======================

// Get Profile
router.get("/profile", protect, getUserProfile);

// Update Profile
router.put("/profile", protect, updateUserProfile);

module.exports = router;