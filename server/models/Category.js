const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true, // Corrected from trime to trim
    required: true,
  },
  description: {
    type: String,
  },
  courses: [{ // A category can be on multiple courses, so it should be an array
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
  }],
});

module.exports = mongoose.model("Category", categorySchema); // Using Category as the model name
