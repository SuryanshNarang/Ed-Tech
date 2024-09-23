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
        await Course.findByIdAndUpdate({_id:courseId},{
            $push:{ ratingAndReviews:ratingReview._id},
            {new:true},
        })


        //returning the response

        const{}
    }catch(error){

    }
}




//GET average rating: how i knew this? After seeing the UI
//getAllRatingandReview:
