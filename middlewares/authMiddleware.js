//MIDDLEWARE hai so will act in between to check if the request came is valid or not
const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");
//will check authentication in this.
//on the basis of jwt authentication is done
// Middlewares/authMiddleware.js
exports.auth = async (req, res, next) => {
  try {
    const token =
      req.cookies.token ||
      req.body.token ||
      req.header("Authorization").replace("Bearer ", "");
    
    console.log("Extracted Token:", token); // Log the token to debug

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token, authorization denied",
      });
    }

    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decode;
      next();
    } catch (error) {
      console.error("Token Verification Error:", error); // Log the error details
      return res.status(401).json({
        success: false,
        message: "Token is invalid",
      });
    }
  } catch (error) {
    console.error("General Auth Error:", error); // Log general errors
    return res.status(401).json({
      success: false,
      message: "Something went wrong while validating token",
    });
  }
};

//isStudent auth done on basis of role.
exports.isStudent = async (req, res, next) => {
  //at the time of login controller we created a payload which contained user role
  try {
    //1) req m se we can find out first method
    //2) second can be taking from DB accountType
    //but we will go with first method as we already have the data
    if (req.user.accountType !== "Student") {
      return res.status(401).json({
        success: false,
        message: "User is not a student",
      });
    }
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Something wen wrong while validating user role",
    });
  }
  next();
};
//isInstructor
exports.isInstructor = async (req, res, next) => {
  try {
    //1) req m se we can find out first method
    //2) second can be taking from DB accountType
    //but we will go with first method as we already have the data
    if (req.user.accountType !== "Instructor") {
      return res.status(401).json({
        success: false,
        message: "User is not a student",
      });
    }
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Something wen wrong while validating user role",
    });
  }
  next();
};
//isAdmin
exports.isAdmin = async (req, res) => {
  try {
    //1) req m se we can find out first method
    //2) second can be taking from DB accountType
    //but we will go with first method as we already have the data
    if (req.user.accountType !== "Admin") {
      return res.status(401).json({
        success: false,
        message: "User is not a student",
      });
    }
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Something wen wrong while validating user role",
    });
  }
  next();
};
