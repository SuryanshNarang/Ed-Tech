const mongoose = require("mongoose");

// Connect to MongoDB
const sectionSchema = new mongoose.Schema({
  sectionName: {
    type: String,
  },
  subSection: [
    {
      type: mongoose.Schema.Types.ObjectId, //subsection idhar add krna hai
      required: true,
      ref: "SubSection",
    },
  ],
});
module.exports= mongoose.model("Section", sectionSchema);