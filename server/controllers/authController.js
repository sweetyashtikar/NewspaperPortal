import User from "../model/User.js"
import bcrypt from "bcryptjs"
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET 

//get all the users data through pagination
export const getAllUsers = async (req, res) => {
    const page = parseInt(req.query.page) || 1; // default page = 1
    const limit = parseInt(req.query.limit) || 10; // default limit = 10
    const skip = (page - 1) * limit;

    try {
        // Get total users count
        const totalUsers = await User.countDocuments();

        // Fetch users with pagination
        const users = await User.find()
            .skip(skip)
            .limit(limit)
            .select('-password') // exclude password
            .sort({ createdAt: -1 }); // optional: newest first

        res.status(200).json({
            totalUsers,
            page,
            totalPages: Math.ceil(totalUsers / limit),
            users
        });

    } catch (error) {
        console.error("Pagination error:", error);
        res.status(500).json({ msg: 'Server error while fetching users' });
    }
};

//register user
export const registerUser = async (req,res)=>{
    const {email, password, confirmPassword} = req.body;
    console.log("req.body", req.body)

    if(password !== confirmPassword) 
        return res.status(400).json({msg :"Password does not match"})

    try{
        const existingUser = await User.findOne({email})
        if(existingUser)
            return res.status(400).json({msg :"Email already exists, Please Login"})

        const hashPassword = await bcrypt.hash(password,10);
        const newUser = new User({
            email,
            password:hashPassword,
            provider :"local"
        })
        await newUser.save()
        res.status(201).json({msg:'User registered succesfully'})
    }catch(error){
        console.log("error", error)
        res.status(500).json({ msg: 'Server error' });
    }
}


//login controller
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid email or password' });
        }

        const payload = {
            userId: user._id,
            email: user.email,
        };

        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ msg: 'Login successful', token, user: payload });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ msg: 'Server error' });
    }
};
