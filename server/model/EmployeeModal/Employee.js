import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['Editor', 'Journalist', 'Photographer', 'Proofreader','Admin'], required: true },
    mobile: { type: String, required: true },
    department: { type: String, required: true },
    designation: { type: String, required: true },
    status: {
        type: String,
        enum: ['active', 'inactive','pending'],
        default: 'pending'
      }
}, { timestamps: true });

export default mongoose.model('Employee', employeeSchema);
