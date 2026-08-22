const User = require("../models/User");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");

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

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } catch (error) {
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

    // Find User
    const user = await User.findOne({ email });

    // Check Password
    if (
      user &&
      (await bcrypt.compare(password, user.password))
    ) {
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
    ).select("-password");

    if (user) {
      res.status(200).json(user);
    } else {
      return res.status(404).json({
        message: "User not found",
      });
    }
  } catch (error) {
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
  getUserProfile,
  updateUserProfile,
};