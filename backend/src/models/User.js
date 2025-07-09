import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  verificationToken: { type: String },
  resetPasswordToken: { type: String },
  role: { type: String, enum: ['user', 'admin'], default: 'user' }, // Rol por defecto: 'user'
}, { timestamps: true });

export default mongoose.model('User', userSchema);
