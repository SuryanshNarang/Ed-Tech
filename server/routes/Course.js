const express = require("express");
const router = express.Router();
const { auth, isInstructor } = require("../middlewares/authMiddleware");
const {
  createCourse,
  getAllCourses,
  getCourseDetails,
  getInstructorCourses,
  editCourse,
  getFullCourseDetails,
  deleteCourse,
  searchCourse,
  markLectureAsComplete,
} = require("../controllers/Course");
// Route to create a new course
router.post("/create-course", auth, isInstructor, createCourse);

// Route to get all courses
router.get("/all-courses", auth, getAllCourses);

// Route to get details of a specific course
router.post("/course-details", auth, getCourseDetails);

const {
  createSection,
  updateSection,
  deleteSection,
} = require("../controllers/Section");
router.post("/addSection", auth, isInstructor, createSection);
// Update a Section
router.post("/updateSection", auth, isInstructor, updateSection);
// Delete a Section
router.post("/deleteSection", auth, isInstructor, deleteSection);

//CATEGORY
const {
  createCategory,
  showAllCategory,
  categoryPageDetails,
} = require("../controllers/Category");
//CATEGORY ROUTES
router.post("/create-category", auth, createCategory);
router.get("/category-details", auth, showAllCategory);
router.get("/getCategoryPageDetails", auth, categoryPageDetails);

//tested

const {
  createSubSection,
  updateSubSection,
  deleteSubSection,
} = require("../controllers/Subsection");
router.post("/updateSubSection", auth, isInstructor, updateSubSection)
// Delete Sub Section
router.post("/deleteSubSection", auth, isInstructor, deleteSubSection)
// Add a Sub Section to a Section
router.post("/addSubSection", auth, isInstructor, createSubSection)

module.exports = router;
