// backend/src/routes/adminRoutes.js

import express from "express";

// --- Controllers ---
import {
  getAllUsers,
  toggleBlockUser,
  getAllCourses,
  deleteCourse,
} from "../controllers/adminController.js";

// --- Middleware ---
import { protect } from "../middleware/auth.js"; // Standard authentication check
import { allowRoles } from "../middleware/roleMiddleware.js"; // Role-based checks

const router = express.Router();

// -----------------------------------------------------------------
// 👑 ADMIN-ONLY ROUTES
// 
// Apply 'protect' and 'allowRoles("admin")' middleware to all
// subsequent routes defined on this router instance.
// -----------------------------------------------------------------

// Middleware applied to ALL routes defined below in this file
router.use(protect, allowRoles("admin"));

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

export default router;