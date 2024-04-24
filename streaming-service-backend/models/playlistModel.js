import mongoose from 'mongoose';
import { Visibilities } from '../utils/helpers.js';
const playlistSchema = new mongoose.Schema({
  description: {
    type: String,
    required: [true, 'Please provide playlist description'],
  },
  liked_users: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      likedDate: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  title: {
    type: String,
    required: [true, 'Please provide playlist name'],
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  songs: [
    {
      songId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Song',
      },
    },
  ],
  visibility: {
    type: String,
    required: [true, 'Please provide an playlist visibility'],
    enum: {
      values: Visibilities,
      message: 'Invalid playlist visibility type',
    },
  },
  created_date: {
    type: Date,
    default: Date.now,
  },
});

const Playlist = mongoose.model('Playlist', playlistSchema);
export default Playlist;
