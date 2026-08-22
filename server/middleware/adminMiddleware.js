const adminMiddleware = (req, res, next) => {
  try {
    // Check if user exists and is admin
    if (req.user && req.user.isAdmin) {
      next();
    } else {
      res.status(403).json({
        message: "Access Denied. Admin Only.",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = adminMiddleware;