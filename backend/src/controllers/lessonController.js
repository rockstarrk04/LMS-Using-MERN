// backend/src/controllers/lessonController.js
const Lesson = require("../models/Lesson");
const Course = require("../models/Course");

// GET /api/courses/:courseId/lessons
const getLessonsForCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const lessons = await Lesson.find({ course: courseId })
      .sort({ order: 1, createdAt: 1 });

    return res.json({ lessons });
  } catch (error) {
    console.error("getLessonsForCourse error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// POST /api/courses/:courseId/lessons  (instructor/admin only)
const createLessonForCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, description, content, videoUrl, order } = req.body || {};

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    // Ensure course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Only allow course instructor or admin to add lessons
    if (
      req.user.role !== "admin" &&
      course.instructor.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ message: "You are not allowed to add lessons to this course" });
    }

    const lesson = await Lesson.create({
      course: courseId,
      title,
      description,
      content,
      videoUrl,
      order: order ?? 0,
    });

    return res.status(201).json({
      message: "Lesson created successfully",
      lesson,
    });
  } catch (error) {
    console.error("createLessonForCourse error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getLessonsForCourse,
  createLessonForCourse,
};
