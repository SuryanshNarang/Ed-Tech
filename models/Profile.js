const mongoose = require("mongoose");

// Connect to MongoDB
const profileSchema = new mongoose.Schema({
  gender: {
    type: String,
  },
  dob: {
    type: Date,
  },
  about: {
    type: String,
  },
  contactNo: {
    type: Number,
    unique: true,
  },
});
module.exports = mongoose.model("Profile", profileSchema);
