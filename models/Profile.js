const mongoose = require("mongoose");

// Connect to MongoDB
const profileSchema = new mongoose.Schema({
  gender: {
    type: String,
  },
  dateOfBirth: {
    type: Date,
  },
  about: {
    type: String,
  },
contactNumber: {
  type: Number,
  unique: true,
  sparse: true, // This allows multiple documents with `contactNumber` set to `null`
}

});
module.exports = mongoose.model("Profile", profileSchema);
