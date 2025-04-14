import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Admin from "../../model/AdminModal/admin.js"
import dotenv from 'dotenv';

dotenv.config();

export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  // 1. Check for missing fields
  if (!email || !password) {
    return res.status(400).json({ msg: "Please enter both email and password." });
  }

  try {
    // 2. Find admin by email
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(401).json({ msg: "Invalid email or password." });
    }

    // 3. Compare password
    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(401).json({ msg: "Invalid email or password." });
    }

    // 4. Generate JWT
    const token = jwt.sign(
      {
        id: admin._id,
        email: admin.email,
        role: admin.role || 'admin'
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // 5. Return token and user info
    res.status(200).json({
      msg: "Login successful.",
      token,
      user: {
        id: admin._id,
        email: admin.email,
        role: admin.role || 'admin'
      }
    });

  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ msg: "Server error. Please try again later." });
  }
};

//this is controller to update the password of the admin with the authorization
export const updateAdminPassword = async(req,res)=>{
  const adminId = req.user.id;
  const {newPassword} = req.body;
  console.log

  if(!newPassword){
    return res.status(400).json({msg : "New password is required"})
  }
  try{
    const admin = await Admin.findById(adminId)
    if (!admin) {
      return res.status(404).json({ msg: "Admin not found." });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    admin.password = hashedPassword;
    await admin.save();

    res.status(200).json({ msg: "Password updated successfully." });
  }catch(error){
    console.error("Password update error:", err.message);
    res.status(500).json({ msg: "Server error. Please try again later." });
  }


}