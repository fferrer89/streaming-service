import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';

const adminSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: [true, 'Please enter your first name'],
    trim: true,
    validate: [
      validator.isAlpha,
      'Please enter a valid first name, first name can only contain letters'
    ],
    minLength: [2, 'First name must be at least 2 characters long'],
    maxLength: [20, 'First name must be less than 20 characters long']
  },
  last_name: {
    type: String,
    required: [true, 'Please enter your last name'],
    trim: true,
    validate: [
      validator.isAlpha,
      'Please enter a valid last name, last name can only contain letters'
    ],
    minLength: [2, 'Last name must be at least 2 characters long'],
    maxLength: [20, 'Last name must be less than 20 characters long']
  },
  email: {
    type: String,
    required: [true, 'Please enter your email'],
    trim: true,
    unique: true,
    validate: [validator.isEmail, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please enter your password'],
    trim: true,
    minLength: [8, 'Password must be at least 8 characters long'],
    maxLength: [25, 'Password must be less than 25 characters long'],
    select: false
  }
});

adminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 12);
  next();
});

adminSchema.methods.isPasswordCorrect = async function (candidatePassword, adminPassword) {
  return await bcrypt.compare(candidatePassword, adminPassword)
}

const Admin = mongoose.model('Admin', adminSchema);
export default Admin;