// seed.js or inside server.js
import SuperAdmin from '../../model/SuperAdminsModal/superAdmin.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();
import jwt from 'jsonwebtoken';



// Register Super Admin (should ideally be called only once or by DB seeding)
export const registerSuperAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const existingSuperAdmin = await SuperAdmin.findOne({ email });

        if (existingSuperAdmin) {
            return res.status(400).json({ msg: 'Super admin already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newSuperAdmin = new SuperAdmin({
            email,
            password: hashedPassword,
            role: 'superAdmin',
        });

        await newSuperAdmin.save();

        res.status(201).json({ msg: 'Super Admin registered successfully' });
    } catch (err) {
        console.error('Registration Error:', err);
        res.status(500).json({ msg: 'Server Error' });
    }
};

export const superAdminLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const superadmin = await SuperAdmin.findOne({ email });

        if (!superadmin || superadmin.role !== 'superAdmin') {
            return res.status(401).json({ msg: 'Unauthorized: Invalid email or role' });
        }

        const isMatch = await bcrypt.compare(password, superadmin.password);

        if (!isMatch) {
            return res.status(401).json({ msg: 'Invalid password' });
        }

        const token = jwt.sign(
            { id: superadmin._id, role: superadmin.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.status(200).json({
            msg: 'Super Admin login successful',
            token,
            user: {
                id: superadmin._id,
                email: superadmin.email,
                role: superadmin.role,
            }
        });

    } catch (err) {
        console.error('Login error:', err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
};

//Optional: Seed One-Time from Script (if you don’t want to expose /register endpoint)
//You can call this function once during server startup to auto-create the super admin:
export const seedSuperAdmin = async () => {
    const existing = await SuperAdmin.findOne({ email: 'mahainfo@gmail.com' });
    if (!existing) {
        const hashedPassword = await bcrypt.hash('superadmin@123', 10);
        await SuperAdmin.create({
            name: 'Maha Super Admin',
            email: 'mahainfo@gmail.com',
            password: hashedPassword,
            role: 'superAdmin',
        });
        console.log('✅ Super Admin created');
    } else {
        console.log('ℹ️ Super Admin already exists');
    }
};
