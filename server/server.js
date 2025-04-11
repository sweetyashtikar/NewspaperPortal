import express from "express"
import mongoose from "mongoose";
import dotenv from 'dotenv';
import session from "express-session";
import passport from "passport";
import cors from "cors"
import './config/passport.js'; // Load passport strategies

//Routes
import UserRoute from "./routes/authRoute.js"
import EmployeeRoute from "./routes/EmployeeRoute.js";
import adminCreate from "./routes/adminCreateRoute.js"


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
app.use("/superadmin",adminCreate )



app.get('/',(req,res)=>{
    res.send("hello world !,hey from newspaper")
});

app.listen(5000,()=>{
    console.log("server is running on port 5000")
})