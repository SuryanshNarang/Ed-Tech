const mongoose = require("mongoose");

// Connect to MongoDB
const courseProgressSchema = new mongoose.Schema({
  courseID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
  },
  completedVideo: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subsection",
    },
  ],
});
module.exports = mongoose.model("CourseProgress", courseProgressSchema);
