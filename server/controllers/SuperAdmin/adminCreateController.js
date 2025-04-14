import multer from 'multer';
import bcrypt from 'bcryptjs';
import Admin from '../../model/AdminModal/admin.js';
import nodemailer from 'nodemailer';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

// In-memory storage for image
const storage = multer.memoryStorage();
export const upload = multer({ storage }); // Export so you can use it in routes

//controller to fetch all the admin data through pagination
export const getAllAdmins = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // default page = 1
    const limit = parseInt(req.query.limit) || 10; // default limit = 10
    const skip = (page - 1) * limit;

    const totalAdmins = await Admin.countDocuments(); // total number of admins
    const admins = await Admin.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }); // latest first, optional

    res.status(200).json({
      totalPages: Math.ceil(totalAdmins / limit),
      currentPage: page,
      totalAdmins,
      data: admins,
    });
  } catch (error) {
    console.error('Error fetching admin data:', error);
    res.status(500).json({ message: 'Something went wrong while fetching admin data.' });
  }
};

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
      // logo: {
      //   data: logoFile.buffer,
      //   contentType: logoFile.mimetype
      // },
      Navbar,  // Add Navbar array to the new admin object
      footer   // Add footer object to the new admin object
    });

    await newAdmin.save();

    // Send temporary password to email
    if (sendAdminEmail) {
      await sendAdminEmail(email, name, plainPassword, portalName);
    }

    const logAdminDetails = `Email: ${email}, Password: ${plainPassword}\n`;

    fs.appendFile('admindetails.txt', logAdminDetails, (err) => {
      if (err) {
        console.error('Failed to log admin details:', err.message);
      } else {
        console.log('Admin details saved to file.');
      }
    });
    console.log("saved data", newAdmin)
    res.status(201).json({ msg: 'Admin created and email sent successfully', addedDat: newAdmin });

  } catch (error) {
    console.error("Create Admin Error:", error);
    res.status(500).json({ msg: 'Server error while creating admin' });
  }
};


// Email function
const sendAdminEmail = async (email, name, password, portalName) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.SUPER_ADMIN_EMAIL,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: `"Newspaper Portal" <${process.env.SUPER_ADMIN_EMAIL}>`,
    to: email,
    subject: 'Admin Portal Credentials',
    html: `
      <p>Dear ${name},</p>
      <p>Your admin account has been created for the newspaper portal <strong>${portalName}</strong>.</p>
      <p>Please find your <strong>login credentials</strong> below:</p>
      <ul>
        <li><strong>Email:</strong> ${email}</li>
        <li><strong>Password:</strong> ${password}</li>
      </ul>
      <p>
        Please <a href="${portalName}/login" target="_blank">click here</a> to log in to the admin portal.
      </p>
      <p>Kindly log in and change your password upon first login.</p>
      <p>If you face any issues, please contact support at <strong>789274</strong>.</p>
      <p>Thanks,<br/>Maharashtra Informatics Team</p>
    `
  };

  await transporter.sendMail(mailOptions);
};
