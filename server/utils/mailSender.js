const nodemailer = require("nodemailer");

//taki otp ko mail m send krpaye.

const mailSender = async (email, title, body) => {
  try {
    let transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST, //smtp.gmail.com
      auth: {
        user: process.env.MAIL_USER, //your email
        pass: process.env.MAIL_PASSWORD, //your password
      },
    });

    let info = await transporter.sendMail({
      from: "StudyNotion || by Suryansh Narang",
      to: `${email}`,
      subject: `${title}`,
      html: `${body}`,
    });
    console.log(info);
    return info;
  } catch (error) {
    console.log(error);
  }
};
module.exports = mailSender;
