const Course = require("../models/Course");
const { instance } = require("../config/razorpay");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const courseEnrollment = require("../mail/templates/courseEnrollment");

//capture the payment and initiate the raozrpay
exports.capturePayment = async (req, res) => {
  try {
    //Get userID and CourseID
    //userID can be fetched from AuthMiddleware req.user.id and courseID from req.body

    const userId = req.user.id;
    const { courseId } = req.body;
    //validation
    //valid courseID
    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Valid Course ID is required",
      });
    }
    //valid CourseDetail: id ID se jo courseDetail is coming that is valid or not.
    let courseData;
    try {
      courseData = await Course.findById(courseId);
      if (!courseData) {
        return res.status(404).json({
          success: false,
          message: "Course not found",
        });
      }
      //user already paid for the course
      //currently we have userID in the form of String but in the course it is stored in the form of OBJECTID
      //converting UserID to objectID
      const uid = new mongoose.Types.ObjectId(userId);
      if (courseData.studentsEnrolled.includes(uid)) {
        //then student is already enrolled
        return res.status(400).json({
          success: false,
          message: "User already enrolled for this course",
        });
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "error.message",
      });
    }

    //create order and return response
    //we need to know amount to create order: course model has the price.
    const amount = courseData.price;
    const currency = "INR";
    const options = {
      amount: amount * 100, //amount should be in paisa
      currency: currency,
      receipt: Math.random(Date.now()).toString(),
      notes:{
        courseId: courseId,
        userId: userId,
      }
      payment_capture: 1, //automatically capture the payment
    };
    try{
        //initiate payment using Razorpay:
        const paymentResponse= await instance.orders.create(options);
        console.log(paymentResponse);
        return res.status(200).json({
            success: true,
            message: "Payment initiated successfully",
            courseName: courseData.courseName,
            courseDescription:courseData.courseDescription,
            thumbnail:courseData.thumbnail,
            orderId: paymentResponse.currency//tracking the order.
            amount:paymentResponse.amount,
            paymentId: paymentResponse.id,
        })
    }catch(error){
        console.log(error);
        res.json({
            success: false,
            message: "Failed to initiate payment",
        })
        
    }


    


  } catch (error) {
    return res.status(500).json({
        success: false,
        message: "Error in capturing payment",
    })
  }
};
//TILL NOW ONLY CREATION IS DONE WE STILL HAVE TO CAPTURE THE PAYMENT and authorise it>

exports.verifySignature= async(req,res)=>{
    //we have to do matching: Server ke andar jo Secret pda hai uski matching OR razorpay no jo secret bheja hai
    const webhookSecret= "12346578";
    //for example server has this above webHook the second one will come from Razorpay:
    //2nd secret will be coming in input 
    const signature= req.headers["x-razorpay-signature"];
    //THERE ARE RULES NO WHYYYYYYYYYYYYYYYYYYYY no reasoning
    //we need 3 Steps to convert the WEbhookSecret to encrypt it and then match,
    //hash based message authentication code and one Algorithm: SHA(Secure Hashing Algorithm)
    //this hmac function need an algo and secret key where algo will be SHA
    const shasum=crypto.createHmac("sha256",webhookSecret ); //converting from Object to String
    shasum.update(JSON.stringify(req.body));


}