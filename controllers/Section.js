export Section=require("../models/Section");
const Course= require("../models/Course");
exports.createSection=async(req,res)=>{
    try{
        //data fetch
        const{sectionName, courseId}=req.body; //why courseId so that course can be updated and section name to create it in DB
        //data validation
        if(!sectionName || !courseId){
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            })
        }

        //create section
        const newSection = await Section.create({sectionName});

        //update Course Schema with ObjectId of this section 
        const updatedCourseDetails= await Course.findByIdAndUpdate(courseId,{$push:{courseContent:newSection._id}},{new:true});
        //TODO how to use populate function here so that i can use section and subsection populated together.

        //success response
        return res.status(200).json({
            success: true,
            message: "Section created successfully",
            updatedCourseDetails,
            
        })
    }catch(error){
        return res.status(500).json({
            success: false,
            message: "Error while creating section",
            error,
        })
    }
}