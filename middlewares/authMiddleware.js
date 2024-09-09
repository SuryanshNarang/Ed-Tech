//MIDDLEWARE hai so will act in between
const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");
//will check authentication in this.
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
      const decode = await jwt.verify(token, process.env.JWT_SECFRET);
      console.log(decode);
      req.user = decode;
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
    })
  }
};
//isStudent
//isInstructor
//isAdmin
