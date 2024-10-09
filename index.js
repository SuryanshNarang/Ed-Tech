const express= require('express')
const app= express()

const userRoutes= require('./routes/User');
const paymentRoutes= require('./routes/Payment');
const courseRoutes= require('./routes/Course');
const profileRoutes= require('./routes/Profile');


//database
const database= require('./config/database')
const cookieParser= require("cookie-parser")