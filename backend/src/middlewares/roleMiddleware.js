// middleware/roleMiddleware.js
module.exports.allowRoles = (...allowedRoles) => {
  return (req, res, next) => {
    // If user is blocked, deny access regardless of role
    if (req.user && req.user.isBlocked) {
      return res.status(403).json({ message: "Access denied. Your account is blocked." });
    } else if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied. Insufficient role." });
    }
    next();
  };
};
