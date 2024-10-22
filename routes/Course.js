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
} = require("../controllers/Course")


const{
  createCategory,
  showAllCategory,
  categoryPageDetails
}=require("../controllers/Category")
// Route to create a new course
router.post("/create-course", auth, isInstructor, createCourse);

// Route to get all courses
router.get("/all-courses", auth, getAllCourses);

// Route to get details of a specific course
router.post("/course-details", auth, getCourseDetails);







//CATEGORY ROUTES
router.post("/create-category", auth, createCategory);
router.get("/category-details", auth, showAllCategory);
router.get("/getCategoryPageDetails", auth,categoryPageDetails)




module.exports = router;
