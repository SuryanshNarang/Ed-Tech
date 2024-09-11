const mongoose = require("mongoose");
const tagSchema = new mongoose.Schema({
  name: {
    type: String,
    trime: true,
    required: true,
  },
  description: {
    type: String,
  },
  course: { //one tag can be on multiple courses
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
  },
});
module.exports = mongoose.model("Tag", tagSchema);
