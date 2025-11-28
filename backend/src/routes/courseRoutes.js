// backend/src/routes/courseRoutes.js
const express = require("express");
const router = express.Router();

const {
  getCourses,
  getCourseById,
  createCourse,
  getMyCourses,
} = require("../controllers/courseController");

const {
  getLessonsForCourse,
  createLessonForCourse,
} = require("../controllers/lessonController");


const {
  enrollInCourse,
} = require("../controllers/enrollmentController");

const { protect } = require("../middlewares/authMiddleware");
const { allowRoles } = require("../middlewares/roleMiddleware");

// PUBLIC ROUTES
router.get("/", getCourses);
router.get("/:id", getCourseById);

// INSTRUCTOR/ADMIN: MY COURSES
router.get(
  "/mine",
  protect,
  allowRoles("instructor", "admin"),
  getMyCourses
);

// INSTRUCTOR/ADMIN: CREATE COURSE
router.post(
  "/",
  protect,
  allowRoles("instructor", "admin"),
  createCourse
);

// STUDENT: ENROLL IN COURSE
router.post(
  "/:courseId/enroll",
  protect,
  allowRoles("student"),
  enrollInCourse
);

// LESSONS FOR A COURSE
router.get("/:courseId/lessons", getLessonsForCourse);

router.post(
  "/:courseId/lessons",
  protect,
  allowRoles("instructor", "admin"),
  createLessonForCourse
);

module.exports = router;
