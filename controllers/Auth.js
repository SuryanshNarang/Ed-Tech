const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator");
const Profile = require("../models/Profile");

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
      otp = otpGenerator.generate(6, {
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
      otp,
      contactNumber // Ensure this field is included
    } = req.body;

    //validate krlo
    if (
      !firstname ||
      !lastname ||
      !email ||
      !password ||
      !confirmPassword ||
      !otp ||
      !contactNumber // Add validation for contactNumber
    ) {
      return res.status(403).json({
        success: false,
        message: "All fields are required",
      });
    }
    //match the passwords:
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    //check if user already exists:
    const existingUser = await User.findOne({ email });
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
    if (recentOtp.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No OTP found for this user",
      });
    }

    const { otp: storedOtp } = recentOtp[0]; // Get the stored OTP from the recentOtp

    // Check if the provided OTP matches the stored OTP
    if (otp !== storedOtp) {
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
    const profileDetails = await Profile.create({
      gender: null,
      dob: null,
      about: null,
      contactNumber: contactNumber, // Store the contact number
    }); //whatever id we will receive from here we will store that below:
    
    const newUser = await User.create({
      //storing details with hashedPassword
      firstname,
      lastname,
      email,
      contactNumber,
      password: hashedPassword,
      accountType,
      additionalDetails: profileDetails._id,
      // image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstname}${lastname}`,
    });
    
    return res.status(200).json({
      success: true,
      message: "User registered successfully",
      user: newUser,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if both email and password are provided
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide both email and password",
      });
    }

    // Find user by email
    const user = await User.findOne({ email }).populate("additionalDetails");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if the provided password matches the stored hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    // Generate JWT token if password matches
    const payload = {
      email: user.email,
      id: user._id,
      role: user.accountType,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });

    // Clear password before sending response
    user.password = undefined;

    // Create cookie and send response
    const options = {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: true, // Set to true if using HTTPS
    };

    return res.cookie("token", token, options).status(200).json({
      success: true,
      token,
      message: "Login successful",
      user,
    });

  } catch (error) {
    console.error("Login error:", error);
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
