// backend/src/routes/courseRoutes.js

const express = require("express");

// --- Controllers ---
const {
  getCourses,
  getCourseById,
  createCourse,
  getMyCourses,
  deleteCourse,
  updateCourse,
} = require("../controllers/courseController");
const {
  getLessonsForCourse,
  createLessonForCourse,
} = require("../controllers/lessonController");

// --- Middleware ---
const { protect } = require("../middlewares/authMiddleware"); // Standard auth check
const { allowRoles } = require("../middlewares/roleMiddleware"); // Role-based checks

const router = express.Router();
// -----------------------------------------------------------------
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
// router.post(
//   "/:courseId/enroll",
//   protect,
//   allowRoles("student"),
//   enrollInCourse
// );

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
  protect, // Protect the route
  allowRoles("instructor", "admin"), // Only instructors and admins can create courses
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

// PUT /api/courses/:id - Update a course
router.put(
  "/:id",
  protect,
  allowRoles("instructor", "admin"),
  updateCourse
);

module.exports = router;