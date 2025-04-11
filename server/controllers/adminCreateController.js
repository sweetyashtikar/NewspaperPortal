import multer from 'multer';
import bcrypt from 'bcryptjs';
import Admin from '../model/admin.js';
// import { sendAdminEmail } from '../utils/emailService.js'; // Make sure this exists or comment it out

// In-memory storage for image
const storage = multer.memoryStorage();
export const upload = multer({ storage }); // Export so you can use it in routes

// Controller: Create Admin
export const createAdmin = async (req, res) => {
  try {
    const {
      name,
      email, 
      contactNo,
      portalName,
      language,
      address,
      Navbar,
      footer
    } = req.body;

    const logoFile = req.file;

    // Validate required fields
    if (!name || !email || !contactNo || !portalName || !language || !address ||  !Navbar || !footer) {
      return res.status(400).json({ msg: 'All fields including logo image are required,Navbar array, and footer object are required' });
    }

    
    // Validate Navbar is an array
    if (!Array.isArray(Navbar)) {
      return res.status(400).json({ msg: 'Navbar must be an array' });
    }

    // Validate footer is an object
    if (typeof footer !== 'object' || footer === null) {
      return res.status(400).json({ msg: 'Footer must be an object' });
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(409).json({ msg: 'Email already exists' });
    }

    // Generate random password & hash it
    const plainPassword = Math.random().toString(36).slice(-8); // Temporary password
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    // Create new admin with image as binary
    const newAdmin = new Admin({
      name,
      email,
      password: hashedPassword,
      contactNo,
      portalName,
      language,
      address,
      role: 'admin',
      
      Navbar,  // Add Navbar array to the new admin object
      footer   // Add footer object to the new admin object
    });

    await newAdmin.save();

    // // Send temporary password to email
    // if (sendAdminEmail) {
    //   await sendAdminEmail(email, name, plainPassword);
    // }
console.log("saved data", newAdmin)
    res.status(201).json({ msg: 'Admin created and email sent successfully' , addedDat : newAdmin});

  } catch (error) {
    console.error("Create Admin Error:", error);
    res.status(500).json({ msg: 'Server error while creating admin' });
  }
};
