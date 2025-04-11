import express from "express"
import mongoose from "mongoose";
import dotenv from 'dotenv';
import session from "express-session";
import passport from "passport";
import cors from "cors"
import './config/passport.js'; // Load passport strategies

//Routes
//super Admin routes
import superAdminRoutes from "./routes/superAdminRoute/superAdminRoutes.js";
import adminCreate from "./routes/superAdminRoute/adminCreateRoute.js";

//Admin Routes
import adminRoute from "./routes/AdminRoute/adminRoute.js"
//User Routes
import UserRoute from "./routes/UserRoute/authRoute.js"

//Employee Routes
import EmployeeRoute from "./routes/employeeRoute/EmployeeRoute.js";


const app = express();
app.use(express.json());
app.use(cors())
dotenv.config();


//mongodb connection
mongoose.connect(process.env.MONGO_URI,{ useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));


//using of the routes
app.use('/auth', UserRoute)
app.use("/employee",EmployeeRoute)
app.use("/superadmin",adminCreate ) //api for creating admins , this api is only available for super admins
app.use("/super-admin", superAdminRoutes) //only for login and register for the super admins
app.use("/admin", adminRoute) //this is login for admins


app.get('/',(req,res)=>{
    res.send("hello world !,hey from newspaper")
});

app.listen(5000,()=>{
    console.log("server is running on port 5000")
})