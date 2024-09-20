const SubSection = require("../models/SubSection");
const Section = require("../models/Section"); //because ID will be inserted in SEctionMOdel.
const { uploadImageToCloudinary } = require("../utils/imageUploader");
//create Subsection:

exports.createSubSection = async (req, res) => {
  try {
    //data fetch:
    //now Section is created so we can access the sectionId(jo naya subsection create hga that we have to insert in Section so in which Section? that will be from ID)
    const { sectionId, title, timeDuration, description } = req.body;
    //extract file/video
    const video = req.files.videoFile;
    //validation:
    if (!sectionId || !title || !timeDuration || !description) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    //we have to store videoURL in subsection so to make the URL we have to upload on cloudinary or any other mediamanagement lib.
    const uploadDetails= await uploadImageToCloudinary(video, process.env.FOLDER_NAME);
    
    //in response we will get a secure url
    //create a subsection:
    //now subsection ID will be store in the SectionModel
    //return response
  } catch (error) {}
};
