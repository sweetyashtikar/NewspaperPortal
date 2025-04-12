import mongoose from 'mongoose';

const superAdminSchema = new mongoose.Schema({
  email: {type: String,required: true,unique: true,default: 'mahainfo@gmail.com'},
  password: {type: String,required: true,default: 'superadmin@123'},
  role: {type: String,enum: ['superAdmin'],default: 'superAdmin'},
}, { timestamps: true });

const SuperAdmin = mongoose.model('SuperAdmin', superAdminSchema);

export default SuperAdmin;
