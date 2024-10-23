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
    const video = req.files.video;
    //validation:
    if (!sectionId || !title || !timeDuration || !description) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    console.log(video)
    //we have to store videoURL in subsection so to make the URL we have to upload on cloudinary or any other mediamanagement lib.
    //in response we will get a secure url
    const uploadDetails = await uploadImageToCloudinary(
      video,
      process.env.FOLDER_NAME
    );
    console.log(uploadDetails);
    //create a subsection:
    const SubSectionDetails = await SubSection.create({
        title: title,
        timeDuration: `${uploadDetails.duration}`,
        description: description,
        videoUrl: uploadDetails.secure_url,
      })
   // Use secure_url from Cloudinary response(videoDetails m jo b secure URL hai that wiill be there as we got it from cloudinary) 
    //now subsection ID will be store in the SectionModel
    const updatedSection = await Section.findByIdAndUpdate(
        sectionId, // Directly pass sectionId
        {
          $push: {
            subSection: SubSectionDetails._id, // Push subsection ObjectID into subSection array
          },
        },
        {
          new: true, // Return the updated document
        }
      ).populate('subSection').exec();
      
//Section ke andar Subsection ka data is currently stored in the form of ID but i have to use populated. so that i cant see the ID

    //return response
    return res.status(200).json({
      success: true,
      message: "Subsection created successfully",
      data:updatedSection,
    });
  } catch (error) {
    return res.status(500).json({
        success: false,
        message: "Error while creating subsection",
        error:error.message,
    });
    }
  }

//update SubSection:
exports.updateSubSection =async(req,res)=>{
  
    try{
  //data fetch:
  const{ subSectionId, title,description,timeDuration } = req.body;
  //data validation
  if(!subSectionId || !title || !description || !timeDuration){
      return res.status(400).json({
          success: false,
          message: "All fields are required",
      })
  }
  const subSection = await SubSection.findByIdAndUpdate(subSectionId,{title,description,timeDuration},{new:true});
  return res.status(200).json({
      success: true,
      message: "Subsection updated successfully",
      updatedSubsection: subSection,
  })
 
}
catch(error){
    return res.status(500).json({
        success: false,
        message: "Error while updating subsection",
        error:error.message,
    })
}
   

}

exports.deleteSubSection= async(req,res)=>{
    try{
        //data fetch
        const{subSectionId}=req.params;
        //data validation
        if(!subSectionId){
            return res.status(400).json({
                success: false,
                message: "Missing properties.(subSectionID)",
            })
        }
        await SubSection.findByIdAndDelete(subSectionId);
        return res.status(200).json({
            success: true,
            message: "Subsection deleted successfully",
        })

    }catch(error){
        return res.status(500).json({
            success: false,
            message: "Error while deleting subsection",
            error:error.message, 
        })
    }
}