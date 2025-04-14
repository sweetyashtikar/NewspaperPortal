// User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, sparse: true },
  password: String,
  googleId: String,
  facebookId: String,
  name: String,
  provider: String,
  role: { type: String,default:'users' },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User; // ES Module export