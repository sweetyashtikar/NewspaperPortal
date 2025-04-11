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
