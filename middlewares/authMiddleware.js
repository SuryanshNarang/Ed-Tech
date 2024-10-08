//MIDDLEWARE hai so will act in between to check if the request came is valid or not
const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");
//will check authentication in this.
//on the basis of jwt authentication is done
exports.auth = async (req, res) => {
  try {
    //extract kro token sbse phle
    const token =
      req.cookies.token ||
      req.body.token ||
      req.header("Authorisation").replace("Bearer", "");
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token, authorization denied",
      });
    }
    //verify token now on what basis??? secret key
    try {
      const decode = jwt.verify(token, process.env.JWT_SECFRET);
      console.log(decode); //user role will also be displayed becuase of auth controller
      req.user = decode; //and user role stored in request(check the Profile controller for more logic behind this.)
    } catch (error) {
      //verification isssue
      res.staus(401).json({
        success: false,
        message: "Token is invalid",
      });
    }
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Something wen wrong while validating token",
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
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Something wen wrong while validating user role",
    });
  }
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
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Something wen wrong while validating user role",
    });
  }
  next();
};
