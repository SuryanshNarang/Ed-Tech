const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
    trim: true,
  },
  pwd: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },
  accountType: {
    type: String,
    enum: ["Instructor", "Admin", "Student"],
    default: "Student",
  },
  additionalDetails: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Profile",
  },
  courses: [
    //in array because there will be multiple courses
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
  ],
  token: {
    type: String,
  },
  resetPasswordExpires: {
    type: Date,
  },s
  courseProgress: [
    //in array because there will be multiple coursesprogresses.
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CourseProgress",
    },
  ],
});
module.exports = mongoose.model("User", userSchema);
