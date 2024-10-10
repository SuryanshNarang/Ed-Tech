const express = require("express");
const router = express.Router();
const { auth } = require("../middlewares/authMiddleware");
const {
  createCourse,
  showAllCourses,
  getCourseDetails,
} = require("../controllers/Course");

// Route to create a new course
router.post("/create-course", auth, createCourse);

// Route to get all courses
router.get("/all-courses", auth, showAllCourses);

// Route to get details of a specific course
router.post("/course-details", auth, getCourseDetails);

module.exports = router;
