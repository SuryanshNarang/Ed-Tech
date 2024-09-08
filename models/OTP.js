const mongoose = require("mongoose");
const mailSender=require('../utils/mailSender');
const otpSchema = new mongoose.Schema({
  emaiL: {
    type: String,
    required: true,
  },
  otp:{
    type:String,
    required:true,
  }
  createdAt:{
    type:Date,
    default:Date.now(),
    expires:5*60
  }
});
//schema ke baad and model ke phle we have to create this
async function sendVerificationEmail(email,otp){
  try{
    const mailResponse= await mailSender(email,"Verification Email from Udemy",otp);
    console.log("Mail sent successfully",mailResponse);
  }catch(error){
    console.log("Error occured while sending Mail",error);
    throw new Error('Failed to send verification email');
  }
}

//pre middleware
otpSchema.pre("save",async function(next){
await sendVerificationEmail(this.email,this.otp);
next();
})


module.exports= mongoose.model('OTP', otpSchema);