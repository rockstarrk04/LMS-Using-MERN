// backend/src/routes/courseRoutes.js

import express from "express";

// --- Controllers ---
import {
  getCourses,
  getCourseById,
  createCourse,
  getMyCourses,
  deleteCourse, // Assuming deleteCourse should be included
} from "../controllers/courseController.js";

import {
  getLessonsForCourse,
  createLessonForCourse,
} from "../controllers/lessonController.js";

import {
  enrollInCourse,
} from "../controllers/enrollmentController.js";

// --- Middleware ---
import { protect } from "../middleware/auth.js"; // Standard auth check
import { allowRoles } from "../middleware/roleMiddleware.js"; // Role-based checks

const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

// -----------------------------------------------------------------
// 📚 PUBLIC ROUTES
// -----------------------------------------------------------------

// GET /api/courses - Get all published courses
router.get("/", getCourses);

// GET /api/courses/:id - Get a specific course by ID
router.get("/:id", getCourseById);

// GET /api/courses/:courseId/lessons - Get all lessons for a specific course
router.get("/:courseId/lessons", getLessonsForCourse);

// -----------------------------------------------------------------
// 🔑 PROTECTED ROUTES
// -----------------------------------------------------------------

// POST /api/courses/:courseId/enroll - Student enrolls in a course
router.post(
  "/:courseId/enroll",
  protect,
  allowRoles("student"),
  enrollInCourse
);

// -----------------------------------------------------------------
// 💼 INSTRUCTOR/ADMIN ROUTES
// -----------------------------------------------------------------

// GET /api/courses/mine - Get courses created by the current instructor/admin
router.get(
  "/mine",
  protect,
  allowRoles("instructor", "admin"),
  getMyCourses
);

// POST /api/courses - Create a new course
router.post(
  "/",
  protect,
  allowRoles("instructor", "admin"),
  createCourse
);

// POST /api/courses/:courseId/lessons - Create a new lesson for a course
router.post(
  "/:courseId/lessons",
  protect,
  allowRoles("instructor", "admin"),
  createLessonForCourse
);

// -----------------------------------------------------------------
// 👑 ADMIN ONLY ROUTES (More restrictive)
// -----------------------------------------------------------------

// DELETE /api/courses/:id - Delete a course
// Using allowRoles("admin") for stricter control over deletion
router.delete(
  "/:id",
  protect,
  allowRoles("admin"),
  deleteCourse
);

export default router;