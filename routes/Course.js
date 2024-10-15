const express = require("express");
const router = express.Router();
const { auth } = require("../middlewares/authMiddleware");
const {
  createCourse,
  showAllCourses,
  getCourseDetails,
} = require("../controllers/Course");

const{
  createCategory,
  showAllCategory,
  categoryPageDetails
}=require("../controllers/Category")
// Route to create a new course
router.post("/create-course", createCourse);

// Route to get all courses
router.get("/all-courses", auth, showAllCourses);

// Route to get details of a specific course
router.post("/course-details", auth, getCourseDetails);







//CATEGORY ROUTES
router.post("/create-category", auth, createCategory);
router.get("/category-details", auth, showAllCategory);
router.get("/getCategoryPageDetails", auth,categoryPageDetails)




module.exports = router;
