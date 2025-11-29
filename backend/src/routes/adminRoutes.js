// backend/src/routes/adminRoutes.js

const express = require("express");

// --- Controllers ---
const {
  getAllUsers,
  toggleBlockUser,
  getAllCourses,
  deleteCourse,
} = require("../controllers/adminController");

// --- Middleware ---
const { protect } = require("../middlewares/authMiddleware"); // Standard authentication check
const { allowRoles } = require("../middlewares/roleMiddleware"); // Role-based checks

const router = express.Router();

// -----------------------------------------------------------------
// 👑 ADMIN-ONLY ROUTES
// 
// Apply 'protect' and 'allowRoles("admin")' middleware to all
// subsequent routes defined on this router instance.
// -----------------------------------------------------------------

// Middleware applied to ALL routes defined below in this file
router.use(protect, allowRoles("admin")); // Apply to all routes in this file

// --- User Management ---
// GET /api/admin/users - Get all users
router.get("/users", getAllUsers);

// PATCH /api/admin/users/:id/block - Block or unblock a specific user
router.patch("/users/:id/block", toggleBlockUser);

// --- Course Management ---
// GET /api/admin/courses - Get all courses (including unpublished ones)
router.get("/courses", getAllCourses);

// DELETE /api/admin/courses/:id - Delete a specific course
router.delete("/courses/:id", deleteCourse);

module.exports = router;