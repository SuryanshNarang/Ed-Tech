
const Course= require("../models/Course");
const Section = require("../models/Section");
//Course create krchuke hai isse pehle so we have the courseID when addAsection is clicked then courseID we can send in it.
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

        //update Course.Model with the sectionID or we can say objectID . (course ki ID hai merepaas so we will insert in that course )
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
exports.updateSection= async(req,res)=>{
try{
    //data fetch ? what to update? sectionName.(bcz till now sectionName only we have taken so we can update that only.)
    const{sectionName, sectionId}= req.body;

    //data validation
    if(!sectionName || sectionId){
        return res.status(400).json({
            success: false,
            message: "Missing Properties.",
        })
    }
    //update data
    //we have the id so we can do findbyIDandUpdate (search criteria is sectionID)
     //do we again have to update the course when we are updating the section? NO because ID is already present in it.
    const section= await Section.findByIdAndUpdate(sectionId,{sectionName},{new:true});
    
    //return response.
    return res.status(200).json({
        success: true,
        message: "Section updated successfully",
        updatedSection: section,
    })
 
}catch(error){
    return res.status(500).json({
        success: false,
        message: "Error while updating section",
        error,
    })
    }
}
exports.deleteSection= async(req,res)=>{
    try{
        //sending the id in parameters this time.
        const{sectionId}=req.params;
        if(!sectionId){
            return res.status(400).json({
                success: false,
                message: "Missing Properties.",
            })
        }
        await Section.findByIdAndDelete(sectionId);
        //TODO do we need to delete the entry from the CourseSchema? (When doing testing)
        return res.status(200).json({
            
            success: true,
            message: "Section deleted successfully",
        
        })
    }catch(error){
        return res.status(500).json({
            success: false,
            message: "Error while deleting section",
            error,
        })
    }
}
