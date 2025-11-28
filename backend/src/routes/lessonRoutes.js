// backend/src/routes/lessonRoutes.js
const express = require("express");
const router = express.Router();

const Lesson = require("../models/Lesson");
const Enrollment = require("../models/Enrollment");
const { protect } = require("../middlewares/authMiddleware");
const { allowRoles } = require("../middlewares/roleMiddleware");

// GET /api/lessons/:id
router.get("/:id", protect, async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id).populate(
      "course",
      "title instructor"
    );
    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    const courseId = lesson.course._id;

    // Students must be enrolled
    if (req.user.role === "student") {
      const enrolled = await Enrollment.findOne({
        student: req.user._id,
        course: courseId,
      });

      if (!enrolled) {
        return res
          .status(403)
          .json({ message: "You are not enrolled in this course" });
      }
    }

    // Instructors/admin can access without check
    return res.json({ lesson });
  } catch (error) {
    console.error("get lesson error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
