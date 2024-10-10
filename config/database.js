// config/database.js
const mongoose = require("mongoose");

const connect = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URL, { // Ensure you have MONGO_URI set in your .env file
            //useNewUrlParser: true, // Optional, but can be removed if you're on the latest version
            //useUnifiedTopology: true // Optional, but can be removed if you're on the latest version
        });
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1); // Exit the process with failure
    }
};

module.exports = { connect }; // Ensure you're exporting the connect function
