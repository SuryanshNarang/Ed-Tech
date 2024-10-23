const RatingAndReview = require("../models/RatingAndReview");
const Course = require("../models/Course");
//GET create rating and review
exports.createRating=async(req,res)=>{
    try{
        //data fetch:
        //We are giving rating on a course and there will be a user giving the rating so we got a COURSEID, USERID, rating and review
        //STEPS:
        //getUserID
        const userId= req.user.id; //AUTH MIDDLEWARE IN THE PAYLOAD
        //data from req.body
        const{rating,review,courseId}= req.body; 
        //check if user enrolled or not
        const courseDetails= await Course.findOne({_id:courseId, studentsEnrolled:{$elemMatch:{$eq:userId}}});
        if(!courseDetails){
            return res.status(404).json({
                success: false,
                message: "User is not enrolled in this course"
            });
        }
    
    //check if user already given the rating or review
        const existingReview = await RatingAndReview.findOne({ //if same courseId and userId is there then it simply means its already reviewiddone by user
            user: userId,
            course:courseId,
        });
        // If a review already exists, return a 400 response
        if (existingReview) {
            return res.status(403).json({
                success: false,
                message: "You have already given the rating for this course"
            });
        }
        //now create a new rating
        const ratingReview= await RatingAndReview.create({rating,review,course:courseId,user:userId});



        //update the COurseModel on which course we have done the rating:
      const updatedCourseDetails= await Course.findByIdAndUpdate({_id:courseId},{
            $push:{ ratingAndReviews:ratingReview._id},
            {new:true},
        })
        console.log(updatedCourseDetails);

        //returning the response
        return res.status(200).json({
            success: true,
            message: "Rating and review added successfully",
            ratingReview,
        })
     
    }catch(error){
        return res.status(500).json({
            success: false,
            message: "Error while adding rating and review",
            error,
        })
    }
};

//GET average rating: how i knew this? After seeing the UI
exports.getAverageRating = async(req,res)=>{
    try{
        //getCourseID
        const{courseId}= req.body.courseId;
        
        //calculate average rating
       const result= await RatingAndReview.aggregate([
        {
            //steps: 
            $match:{ course: new mongoose.Tpyes.ObjectId(courseId)}//mujhe ek aisa entry findout krkr do  who's courseId is this in Rating and Review: why monoogoose is written because courseId was in string so we converted it in ObjectId
            
        },{
            //when got all the entries now group!
            $group:{
                _id: null,
                averageRating:{$avg:"$rating"}
            }
        }
       ])
       //check if we got rating or not
       if(result.length>0){
        return res.status(200).json({
            success: true,
            message: "Average rating found successfully",
            averageRating: result[0].averageRating, //array return hora hai and we have the response at 0th  index.
        })
       }

        //if no reating
        return res.status(200).json({
            success: true,
            message: "No rating given for this course",
            averageRating: 0, //if no rating then average rating is 0
        })    

    }catch(error){
        return res.status(500).json({
            success: false,
            message: "Error while getting average rating",
            error,
        })
    }
}
//getAllRatingandReview:
exports.getAllRatingAndReview= async(req,res)=>{
    //this is bringing all the ratingandReview
    //TODO we have to bring on the basis of courseID also.
    try{
        const allReviews= await RatingAndReview.find({})
            .sort({rating:"desc"}).populate({path:"user",select:"firstname lastname email image"}).populate({path:"course",select:"courseName"}).exec()
            return res.status(200).json({
                success:true,
                message: "All Rating and Reviews fetched successfully",
                allReviews, //we are bringing all the reviews in descending order.
            })
        
    }catch(error){
        return res.status(500).json({
            success: false,
            message: "Error while getting all rating and reviews",
            error,
        })
    }
}