const express = require("express");
const app = express();

const userRoutes = require("./routes/User");
const paymentRoutes = require("./routes/Payments");
const courseRoutes = require("./routes/Course");
const profileRoutes = require("./routes/Profile");

//saaare connections.
const database = require("./config/database");
const cookieParser = require("cookie-parser");
//we want our backend to entertain requests of frontend

const cors = require("cors");
const { cloudinaryConnect } = require("./config/cloudinary"); //TODO add config

//file upload
const fileUpload = require('express-fileupload');
const dotenv = require("dotenv");
dotenv.config();
const PORT= process.env.PORT || 4001;

//database connect:
database.connect();

//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin: "http://localhost:3000", //allow requests from this origin
        credentials: true, //allow sending cookies
    })
)

app.use(
	fileUpload({
		useTempFiles:true,
		tempFileDir:"/tmp",
	})
)

//cloudinary:
cloudinaryConnect();

//routes mounting.
app.use("/api/v1/auth", userRoutes);         // For user authentication routes
app.use("/api/v1/profile", profileRoutes);   // For profile routes
app.use("/api/v1/course", courseRoutes);     // For course routes
app.use("/api/v1/payment", paymentRoutes);   // For payment routes





//default route
app.get("/",(req,res)=>{
    return res.json({
        success: true,
        message: "Welcome to StudyNotion API your server is up and running"
    })
})


//activating the server:
app.listen(PORT,()=>{
    console.log(`App is running on port ${PORT}`);
})