
import Employee from "../../model/EmployeeModal/Employee.js";
import bcrypt from "bcryptjs"
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET 

//get all the employee data through pagination
export const getAllEmployee = async (req, res) => {
    const page = parseInt(req.query.page) || 1; // default page = 1
    const limit = parseInt(req.query.limit) || 10; // default limit = 10
    const skip = (page - 1) * limit;

    try {
        // Get total users count
        const totalEmployee = await Employee.countDocuments();

        // Fetch users with pagination
        const employees = await Employee.find()
            .skip(skip)
            .limit(limit)
            .select('-password') // exclude password
            .sort({ createdAt: -1 }); // optional: newest first

        res.status(200).json({
            totalEmployee,
            page,
            totalPages: Math.ceil(totalEmployee / limit),
            employees
        });

    } catch (error) {
        console.error("Pagination error:", error);
        res.status(500).json({ msg: 'Server error while fetching users' });
    }
};

export const registerEmployee = async (req, res) => {
    const { name, email, password, confirmPassword, role, mobile, department, designation } = req.body;
    console.log("Register Request Body:", req.body);

    if (password !== confirmPassword) {
        return res.status(400).json({ msg: "Passwords do not match" });
    }

    try {
        const existingemployee = await Employee.findOne({ email });
        if (existingemployee) {
            return res.status(400).json({ msg: "Email already exists. Please login." });
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const newemployee = new Employee({
            name,
            email,
            password: hashPassword,
            role,
            mobile,
            department,
            designation,
            status:'pending'
        });

        await newemployee.save();
        res.status(201).json({ msg: 'employee registered successfully' });

    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ msg: "Server error" });
    }
};

export const loginemployee = async (req, res) => {
    const { email, password } = req.body;

    // 🔹 400: Bad Request – Missing fields
    if (!email || !password) {
        return res.status(400).json({ msg: 'Email and password are required' });
    }

    try {
        // 🔹 Check if employee exists
        const employee = await Employee.findOne({ email });

        // 🔹 404: Not Found – employee not registered
        if (!employee) {
            return res.status(404).json({ msg: 'Employee not found' });
        }

        // 🔹 403: Forbidden – Inactive employee (Optional)
        if (employee.status === 'inactive') {
            return res.status(403).json({ msg: 'Your account is inactive. Please contact admin.' });
        }

        // 🔹 401: Unauthorized – Wrong password
        const isMatch = await bcrypt.compare(password, employee.password);
        if (!isMatch) {
            return res.status(401).json({ msg: 'Invalid email or password' });
        }

        // 🔹 Create token
        const payload = {
            employeeId: employee._id,
            name: employee.name,
            email: employee.email,
            role: employee.role
        };

        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

        // 🔹 200: OK – Successful login
        return res.status(200).json({
            msg: 'Login successful',
            token,
            employee: {
                id: employee._id,
                name: employee.name,
                email: employee.email,
                role: employee.role
            }
        });

    } catch (error) {
        console.error('Login error:', error);

        // 🔹 500: Internal Server Error
        return res.status(500).json({
            msg: 'Server error. Please try again later.',
            error: error.message
        });
    }
};