const Profile = require("../models/Profile");
const User = require("../models/User");
//we dont have to create profile because we already created in the signUp handler we created a fake one now we only have to update it
exports.updateProfile = async (req, res) => {
  try {
    //we will require userID
    //if user is LoggedIn: so middleware Authentication vala we DECODED the token and the response we stored in the REQUEST.
    //so request has my USERID .
    //data fetching(userid also):
    const id = req.user.id; //because in middleware req.user we had the token for this.(check payload we need ID from there)

    const { dateofBirth = "", about = "", contactNumber, gender } = req.body; //bcoz dob and about are optional

    //validation
    if (!contactNumber || !gender || !id) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    //find profile: how to? do we have any profileID? NO
    //we can have userDetail
    const userDetails = await User.findByIdAndUpdate(id); //we got all the userDetails
    //now we can have the profileID in the name of additionDetails
    const profileID = userDetails.additionalDetails;
    //now we can have profile data
    const profileDetails = await Profile.findById(profileID);
    //update Profile
    profileDetails.dateOfBirth = dateofBirth;
    profileDetails.about = about;
    profileDetails.contactNo = contactNumber;
    profileDetails.gender = gender;
    //different syntax because object was already created.
    //so we have to save it
    await profileDetails.save();
    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      updatedProfile: profileDetails,
    });

    //return response:
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while updating profile",
      error: error.message,
    });
  }
};
//HOMEWORK: to findout scheduling of deleting the user accouunt ki request around 5days tak jaye for deleteing the account.
