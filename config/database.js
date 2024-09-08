const mongoose = require("mongoose");
require("dotenv").config();

exports.connect = () => {
  mongoose
    .connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("Database Connected successfully"))
    .catch((err) => {
      console.log("error connecting to database");
      console.error(err);
      process.exit(1);
    });
};
