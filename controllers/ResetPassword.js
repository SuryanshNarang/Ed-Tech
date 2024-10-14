const bcrypt = require('bcrypt');
const User = require("../models/User");
const mailSender = require("../utils/mailSender");

//reset password (token)
//ek token create krke user ko mail send krta tha us mail ke andar link hota tha then on that link frontend opens then password is changed.
exports.resetPasswordToken = async (req, res) => {
  try {
    //get email from request body
    //check user for this email, email validation
    const email = req.body.email;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found when resetting password",
      });
    }
    //so we have to create a token: token and expiry time: (POINT TO BE NOTED we can add this in user ka schema because mapping will be easy: every user has his token and expiry time)
    const token = crypto.randomUUID(); //token generated

    const updatedDetails = await User.findOneAndUpdate(
      { email: email },
      {
        //add token inside user DB
        token: token,
        resetPasswordExpires: Date.now() + 5 * 60 * 1000,
      },
      { new: true } //with this we will get the updated details otherwise old document will appear
    );

    //link generate, below is the frontend link. (different links for different users)
    const url = `http://localhost:3000/update-password/${token}`;
    //send mail containing the URL
    await mailSender(
      email,
      "Password Reset Link",
      `Password Reset Link ${url}`
    );
    //return response
    return res.json({
      success: true,
      message: "Reset password link sent successfully",
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

//reset password function
exports.resetPassword = async (req, res) => {
  try {
    //3 things will be there token, password, confirm password
    //after clicking on the link we are redirected to the UI where new password is entered
    //now those new password will come in this function and we have to store them

    //we can also take token form URL which we made above. but the request body will always have it frontend automatically will put it in request body:

    //STEPS:
    //data fetch
    const { password, confirmPassword, token } = req.body;
    //validation
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }
    //where will these new passwords will be inserted?? User ke andar password entry will be updated.
    //but how will we get the user entry?? Token will be used to get user ID 
    //so get user details from user DB using token
    const userDetails = await User.findOne({ token: token }); //why? because we have to store the info of the user 

    //if no entry of the token or time might have expired: invalid
    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "Token is invalid",
      });
    }
    //token time check
    if (userDetails.resetPasswordExpires < Date.now()) {
      return res.json({
        success: false,
        message: "Token has expired, Please regenerate your token",
      });
    }
    //password hash hga again
    const hashedPassword = await bcrypt.hash(password, 10);

    //update password now.
    await User.findOneAndUpdate(
      { token: token }, //on the basis of the token
      { password: hashedPassword }, //update this value.
      { new: true } // Added missing comma
    );
    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Reset password error",
    });
  }
};

//thats why name resetPasswordToken was kept so that we can generate a token , store it in the User DB, and using that token we can upate user's password
