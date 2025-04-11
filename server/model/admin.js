import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['admin'], default: 'admin' },
  contactNo: String,
  portalName: String,
  language: String,
  address: String,
  logo: {
    data: Buffer,
    contentType: String
  },
  Navbar: { type: Array, required: true },
  footer: { type: Object, required: true }

}, { timestamps: true });

export default mongoose.model("Admin", AdminSchema);


