const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator");
require("dotenv").config();
//sendOtp
exports.sendOTP = async (req, res) => {
  try {
    //fetch email from req ki body
    const { email } = req.body;
    //check if user already exists
    const checkUserPresent = await User.findOne({ email });
    if (checkUserPresent) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    //generate OTP
    var otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    console.log("otp generated successfully", otp);

    //check unique otp or not
    let result = await OTP.findOne({ otp: otp });
    while (result) {
      otp = otpGenerator(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      result = await OTP.findOne({ otp: otp });
    }
    //in companies we interact with services which offer unique otp only its a brute force approach which we used.
    //to enter the otp in the database
    const otpPayload = { email, otp };
    //inserting otp into the database
    const otpBody = await OTP.create(otpPayload);
    console.log(otpBody);

    //return response
    res.status(200).json({
      success: true,
      message: "OTP sent   successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to send OTP",
    });
  }
};

//signup
require("dotenv").config();
exports.signup = async (req, res) => {
  try {
    //data fetch from request ki body:
    const {
      firstname,
      lastname,
      email,
      password,
      confirmPassword,
      accountType,
      contactNumber,
      otp,
    } = req.body;

    //validate krlo
    if (
      !firstname ||
      !lastname ||
      !email ||
      !password ||
      !confirmPassword ||
      !otp
    ) {
      return res.status(403).json({
        success: false,
        message: "All fields are required",
      }); //account type is a tab in which one will always be selected so we didnt took it.
    }
    //match the passwords:
    if (password != confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    //check if user already exists:
    const existingUser = await user.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }
    //find most recent otp of the user which were sent to the user.
    const recentOtp = await OTP.find({ email })
      .sort({ createdAt: -1 })
      .limit(1);
    console.log(recentOtp);
    //validateOTP
    if (recentOtp.length == 0) {
      return res.status(400).json({
        success: false,
        message: "No OTP found for this user",
      });
    } else if (otp !== recentOtp.otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    //if user is new start his password hashing
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 10);
    } catch (e) {
      res.status(400).json({
        success: false,
        message: "Failed to hash password",
      });
    }
    //creating an entry of the new user in DB
    //we created the reference of additonal details with Profile model and we need a objectID so to get the objectID we have to store it in the DB

    const profileDetails = await Profile.create({
      gender: null,
      dob: null,
      about: null,
      contactNo: null,
    }); //whatever id we will recieve from here we will store that below:
    const user = await User.create({
      //storing details with hashedPassword
      firstname,
      lastname,
      email,
      contactNumber,
      password: hashedPassword,
      accountType,
      additionalDetails: profileDetails._id,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstname}${lastname}`,
    });
    return res.status(200).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
//login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    //if user hasn't put any data for the email or password on the login screen
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide both email and password",
      });
    }
    //check if user exists or not
    //use findOne method to check the email in the DB
    const user = await User.findOne({ email }).populate("additionalDetails");
    if (!user) {
      //login ho rha h bro
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    if (await bcrypt.compare(password, user.password)) {
      //if password is matched which is there in DB and which user has given
      //if password is correct then generate JWT token.
      const payload = {
        email: user.email,
        id: user._id,
        role: user.accountType,
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "2h",
      });
      //inserted token inside user
      user.token = token;
      user.password = undefined;
      //create cookie and send response
      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: true, //if we are running server on https then true otherwise false.
      };
      res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        message: "Login successful",
        user,
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "Incorrect password",
      });
    }
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Login error",
    });
  }
};
//Change password.
exports.changePassword = async (req, res) => {
  //get data from req body
  //we are changing password

  //3 types of data would be there old,new and confirm new password
  const { oldpassword, newpassword, confirmnewpassword } = req.body;
  //validation they are not empty, matching should be there
  if (!oldpassword || !newpassword || confirmnewpassword) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }
  //check if new password matches confirm new Password
  if (newpassword !== confirmnewpassword) {
    return res.status(400).json({
      success: false,
      message: "New password and confirm new password must match",
    });
  }
  //update in database.
  //mail send krdo password is updated.
  //return response.
};
