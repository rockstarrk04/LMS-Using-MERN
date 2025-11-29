// backend/src/routes/enrollmentRoutes.js
const express = require("express");
const router = express.Router();
const {
  getMyEnrollments,
  enrollInCourse, // Add enrollInCourse
  getEnrollmentById,
} = require("../controllers/enrollmentController");
const { protect } = require("../middlewares/authMiddleware");
const { allowRoles } = require("../middlewares/roleMiddleware");

// GET /api/enrollments/me
router.get("/me", protect, allowRoles("student"), getMyEnrollments);

// GET /api/enrollments/:id
router.get("/:id", protect, allowRoles("student"), getEnrollmentById);

// POST /api/enrollments/:courseId/enroll - Student enrolls in a course
router.post(
  "/:courseId/enroll",
  protect,
  allowRoles("student"),
  enrollInCourse
);

module.exports = router;
