const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ==========================================
// Protect Route
// ==========================================
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
      );

      // Get logged-in user
      req.user = await User.findById(decoded.id).select(
        "-password"
      );

      // User not found
      if (!req.user) {
        return res.status(401).json({
          message: "User not found",
        });
      }

      next();
    } catch (error) {
      console.error("Auth Error:", error);

      return res.status(401).json({
        message: "Not Authorized, Token Failed",
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      message: "Not Authorized, No Token",
    });
  }
};

// ==========================================
// Admin Middleware
// ==========================================
const admin = (req, res, next) => {
  try {
    if (req.user && req.user.isAdmin) {
      next();
    } else {
      return res.status(403).json({
        message: "Access Denied. Admin Only.",
      });
    }
  } catch (error) {
    console.error("Admin Error:", error);

    return res.status(500).json({
      message: error.message,
    });
  }
};

// ==========================================
// Export
// ==========================================
module.exports = {
  protect,
  admin,
};