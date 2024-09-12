const Course = require("../models/Course");
const Tag = require("../models/Tag");
const User = require("../models/User");
//course thumbnail is there so we will have to use cloudinary

const { uploadImageToCloudinary } = require("../utils/imageUploader");
//create course handler function
exports.createCourse = async (req, res) => {
  try {
    //we need user ID where will we get it? from authMiddleware we passed in payload the user id and stored it in request.
    //if we remove it from payload? lets see another method to get the ID of the USER
    const { courseName, courseDescription, whatYouWillLearn, price, tag } =
      req.body;
    //get thumbnail
    const thumbnail = req.files.thumbnailImage;

    //validation
    if (!courseName || !courseDescription || !price || !tag || !thumbnail) {
      res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    //check for instructor? already done in middleware then why are we checking it again
    //ans: because only instructor will make the course. (we have to make a DB call for it )
    //check in Course model there is instructor object ID so to get that ID we wo;; dp a DB call
    const userID = req.user.id; //we have to first get the userID
    const instructorDetails = await User.findById(userID);
    console.log("Instructor Details", instructorDetails);

    if (!instructorDetails) {
      return res.status(404).json({
        success: false,
        message: "Instructor Details not found",
      });
    }
    //check given tag in input valid or not
    const tagDetails = await Tag.findById(tag);
    if (!tagDetails) {
      return res.status(404).json({
        success: false,
        message: "Tag Details not found",
      });
    }
    //upload image to cloudinary
    const thumbnailImage = await uploadImageToCloudinary(
      thumbnail,
      process.env.FOLDER_NAME
    );
    //create an entry for new course
    const newCourse = await Course.create({
      courseName,
      courseDescription,
      instructor: instructorDetails._id, //new course create krte time we fetched instructor details and ID and we need OBJECTID to create the entry in DB
      whatYouWillLearn,
      price,
      tag: tagDetails._id,
      thumbnail: thumbnailImage.secure_url,
    });
    //add the new course to the user schema of Instructor (instructor ki list m course ko add krna hai )
    await User.findByIdAndUpdate(
      { _id: instructorDetails._id }, // Query to find the user by ID
      {
        $push: {
          courses: newCourse._id, // Pushing the new course ID into the courses array
        },
      },
      { new: true } // This option returns the updated document
    );
    //got the instructor id
    //user ke record ke andar course ke array ke andar we have to add the ID of it.
  } catch (error) {}
};

//get all course handler function
