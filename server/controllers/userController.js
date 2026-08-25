const User = require("../models/User");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");
const sendEmail = require("../utils/sendEmail");

// =======================
// Register User
// =======================
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Please fill all fields",
      });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(
      password,
      salt
    );

    // Generate 6-digit OTP
    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    // OTP expires after 10 minutes
    const otpExpiresAt = new Date(
      Date.now() + 10 * 60 * 1000
    );

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      isVerified: false,
      otp,
      otpExpiresAt,
    });

    // Send OTP Email
    await sendEmail.sendOTPEmail(
      email,
      otp
    );

    res.status(201).json({
      message:
        "Registration successful. OTP has been sent to your email.",
      email: user.email,
    });
  } catch (error) {
    console.error("Register Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// =======================
// Login User
// =======================
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check required fields
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    // Find User
    const user = await User.findOne({ email });

    // Check User and Password
    if (
      user &&
      (await bcrypt.compare(password, user.password))
    ) {
      // Check Email Verification
      if (!user.isVerified) {
        return res.status(401).json({
          message:
            "Please verify your email with OTP first",
        });
      }

      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      });
    } else {
      return res.status(401).json({
        message: "Invalid Email or Password",
      });
    }
  } catch (error) {
    console.error("Login Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// =======================
// Verify OTP
// =======================
const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Check required fields
    if (!email || !otp) {
      return res.status(400).json({
        message: "Email and OTP are required",
      });
    }

    // Find User
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Check if already verified
    if (user.isVerified) {
      return res.status(400).json({
        message: "Email is already verified",
      });
    }

    // Check OTP
    if (user.otp !== otp) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    // Check OTP expiry
    if (
      !user.otpExpiresAt ||
      user.otpExpiresAt < new Date()
    ) {
      return res.status(400).json({
        message: "OTP has expired",
      });
    }

    // Verify User
    user.isVerified = true;
    user.otp = null;
    user.otpExpiresAt = null;

    await user.save();

    // Generate token after successful verification
    const token = generateToken(user._id);

    res.status(200).json({
      message: "Email verified successfully",
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token,
    });
  } catch (error) {
    console.error("OTP Verification Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// =======================
// Get User Profile
// =======================
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(
      req.user._id
    ).select("-password -otp -otpExpiresAt");

    if (user) {
      res.status(200).json(user);
    } else {
      return res.status(404).json({
        message: "User not found",
      });
    }
  } catch (error) {
    console.error("Get Profile Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// =======================
// Update User Profile
// =======================
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Update allowed profile fields
    user.name = req.body.name || user.name;
    user.phone = req.body.phone ?? user.phone;
    user.address = req.body.address ?? user.address;

    const updatedUser = await user.save();

    res.status(200).json({
      message: "Profile Updated Successfully",

      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        address: updatedUser.address,
        isAdmin: updatedUser.isAdmin,
      },
    });
  } catch (error) {
    console.error("Update Profile Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// =======================
// Export
// =======================
module.exports = {
  registerUser,
  loginUser,
  verifyOTP,
  getUserProfile,
  updateUserProfile,
};