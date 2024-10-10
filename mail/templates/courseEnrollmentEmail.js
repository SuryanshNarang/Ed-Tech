// courseEnrollmentEmail.js



// Template for course enrollment email
const courseEnrollmentEmailTemplate = (studentName, courseDetails) => {
  const { courseName, courseDescription, price, instructor, whatYouWillLearn, thumbnail } = courseDetails;
  return `
    <html>
      <head>
        <title>Course Enrollment Confirmation</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 20px;
          }
          .container {
            background-color: #fff;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }
          h1 {
            color: #333;
          }
          p {
            color: #555;
          }
          .footer {
            margin-top: 20px;
            font-size: 12px;
            color: #aaa;
          }
          .course-thumbnail {
            max-width: 100%;
            height: auto;
            border-radius: 5px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Enrollment Confirmation</h1>
          <p>Dear ${studentName},</p>
          <p>Thank you for enrolling in the <strong>${courseName}</strong> course!</p>
          <img src="${thumbnail}" alt="Course Thumbnail" class="course-thumbnail" />
          <p><strong>Course Description:</strong> ${courseDescription}</p>
          <p><strong>What You Will Learn:</strong> ${whatYouWillLearn}</p>
          <p><strong>Instructor:</strong> ${instructor.name}</p>
          <p><strong>Price:</strong> $${price}</p>
          <p>Your course will be available for you to start learning immediately.</p>
          <p>If you have any questions, feel free to reach out to us.</p>
          <p>Best Regards,<br>Your Course Team</p>
        </div>
        <div class="footer">
          <p>This is an automated message, please do not reply.</p>
        </div>
      </body>
    </html>
  `;
};

// Function to send the email (example)
const sendEnrollmentEmail = (studentName, courseDetails, recipientEmail) => {
  const emailContent = courseEnrollmentEmailTemplate(studentName, courseDetails);
  
  // Example: Sending email logic (use your preferred email sending library/method here)
  // transporter.sendMail({
  //   to: recipientEmail,
  //   subject: 'Course Enrollment Confirmation',
  //   html: emailContent,
  // }, (error, info) => {
  //   if (error) {
  //     return console.log('Error sending email:', error);
  //   }
  //   console.log('Email sent:', info.response);
  // });
};

// Export the template and function
module.exports = {
  courseEnrollmentEmailTemplate,
  sendEnrollmentEmail
};
