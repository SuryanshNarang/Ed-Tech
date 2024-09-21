const Course = require("../models/Course");
const { instance } = require("../config/razorpay");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const courseEnrollment = require("../mail/templates/courseEnrollment");

//capture the payment and initiate the raozrpay
exports.capturePayment = async (req, res) => {
  try {
    //Get userID and CourseID
    //userID can be fetched from AuthMiddleware req.user.id and courseID from req.body

    const userId = req.user.id;
    const { courseId } = req.body;
    //validation
    //valid courseID
    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Valid Course ID is required",
      });
    }
    //valid CourseDetail: id ID se jo courseDetail is coming that is valid or not.
    let courseData;
    try {
      courseData = await Course.findById(courseId);
      if (!courseData) {
        return res.status(404).json({
          success: false,
          message: "Course not found",
        });
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error fetching course details",
      });
    }

    //user already paid for the course
    //create order and return response
  } catch (error) {}
};
