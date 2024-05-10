import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import { Genders, MusicGenres } from '../utils/helpers.js';

const artistSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: [true, 'Please enter your first name'],
    trim: true,
    validate: [
      validator.isAlpha,
      'Please enter a valid first name, first name can only contain letters',
    ],
    minLength: [2, 'First name must be at least 2 characters long'],
    maxLength: [20, 'First name must be less than 20 characters long'],
  },
  last_name: {
    type: String,
    required: [true, 'Please enter your last name'],
    trim: true,
    validate: [
      validator.isAlpha,
      'Please enter a valid last name,last name can only contain letters',
    ],
    minLength: [2, 'Last name must be at least 2 characters long'],
    maxLength: [20, 'Last name must be less than 20 characters long'],
  },
  display_name: {
    type: String,
    required: [true, 'Please enter your display name'],
    trim: true,
    validate: {
      validator: function(value) {
        return /^[a-zA-Z0-9 ]*$/.test(value);
      },
      message: 'Please enter a valid display name, display name can only contain letters, numbers, and spaces',
    },
    minLength: [2, 'Display name must be at least 2 characters long'],
    maxLength: [20, 'Display name must be less than 20 characters long'],
  },
  email: {
    type: String,
    required: [true, 'Please enter your email'],
    trim: true,
    unique: true,
    validate: [validator.isEmail, 'Please enter a valid email'],
  },
  created_date: {
    type: Date,
    default: Date.now,
  },
  password: {
    type: String,
    required: [true, 'Please enter your password'],
    trim: true,
    minLength: [8, 'Password must be at least 8 characters long'],
    select: false,
  },
  password_changed_date: {
    type: Date,
  },
  date_of_birth: {
    type: String,
    trim: true,
  },
  gender: {
    type: String,
    enum: {
      values: Genders,
      message: 'Invalid gender',
    },
  },
  following: {
    users: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
    artists: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Artist',
      },
    ],
  },
  followers: {
    users: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
    artists: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Artist',
      },
    ],
  },
  profile_image_url: {
    type: mongoose.Schema.ObjectId,
    required: false,
  },
  genres: {
    type: [String],
    required: [true, 'Please provide genres for artist'],
    enum: {
      values: MusicGenres,
      message: 'Invalid gender',
    },
  },
});

artistSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);

  next();
});

artistSchema.methods.isPasswordCorrect = async function (
  candidatePassword,
  artistPassword
) {
  return await bcrypt.compare(candidatePassword, artistPassword);
};

artistSchema.methods.changedAfter = function (JWTTimestamp) {
  if (this.password_changed_date) {
    const passwordChangedAtTimestamp = parseInt(
      this.password_changed_date.getTime() / 1000,
      10
    );
    return JWTTimestamp < passwordChangedAtTimestamp;
  }
  return false;
};

const Artist = mongoose.model('Artist', artistSchema);
export default Artist;