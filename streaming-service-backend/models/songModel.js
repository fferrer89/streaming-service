import mongoose from 'mongoose';
import validator from 'validator';

import { MusicGenres } from '../utils/helpers.js';
const songSchema = new mongoose.Schema({
  album: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Album',
  },
  artists: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Artist' }],
    required: [true, 'Please provide artist'],
    validate: [
      {
        validator: (art) => {
          //  console.log(art);
          if (!art || art.length == 0) {
            return false;
          }
          return true;
        },
        message: () => `Please provide at least one artist`,
      },
      {
        validator: (art) => {
          for (let i = 0; i < art.length; i++) {
            if (art[i].toString().trim().length == 0) {
              return false;
            }
          }
          return true;
        },
        message: () => `Artist can't be empty spaces`,
      },
    ],
  },
  duration: {
    type: Number,
    required: false,
    validate: {
      validator: (dur) => {
        return /^\d+$/.test(dur);
      },
      message: () => `Not a valid Duration!`,
    },
    min: [1, 'Duration cant be less than or equal to 0'],
    max: [7200, 'Duration cant be more than or equal to 7200'],
  },
  title: {
    type: String,
    required: [true, 'Please provide song title'],
    trim: true,
    // validate: [
    //   validator.isAlphanumeric,
    //   'Please enter a valid title, title can only contain letters',
    // ],

    minLength: [2, 'Title must be at least 2 characters long'],
    maxLength: [30, 'title must be less than 30 characters long'],
  },
  likes: {
    type: Number,
    required: false,
    min: [0, 'Likes cant be negative'],
  },
  song_url: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'Please provide song URL'],
    trim: true,
  },
  cover_image_url: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    trim: true,
  },
  writtenBy: {
    type: String,
    required: [true, 'Please provide writer name'],
    trim: true,
    // validate: [
    //   validator.isAlphanumeric,
    //   "Please enter a valid Writer's name, can only contain letters",
    // ],
    minLength: [2, "Writer's name must be at least 2 characters long"],
    maxLength: [30, "Writer's name must be less than 30 characters long"],
  },
  producers: {
    type: [String],
    required: [true, 'Please provide producer names'],
    // validate: {
    //   validator: (prods) => {
    //     // Check if array is not empty
    //     if (prods.length === 0) return false;

    //     for (const prod of prods) {
    //       // Check if string is not empty or just spaces
    //       if (!prod.trim()) return false;

    //       // Check if string contains only letters
    //       if (!/^[a-zA-Z\s]+$/.test(prod)) return false;
    //     }

    //     return true;
    //   },
    //   message: () =>
    //     `Invalid array of strings. Please make sure it's not empty, doesn't contain only spaces, and contains only letters.`,
    // },
  },
  language: {
    type: String,
    required: false,
    trim: true,
    validate: [
      validator.isAlpha,
      'Please enter a valid Language, title can only contain letters',
    ],
    minLength: [2, 'Language must be at least 2 characters long'],
    maxLength: [30, 'Language must be less than 30 characters long'],
  },
  genre: {
    type: String,
    required: [true, 'Please provide genre'],
    enum: {
      values: MusicGenres,
      message: 'Invalid genre for song',
    },
  },
  lyrics: {
    type: String,
    required: false,
    trim: true,
  },
  release_date: {
    type: Date,
    required: [true, 'Please provide release date'],
  },
});

const Song = mongoose.model('Song', songSchema);
export default Song;
