import mongoose from 'mongoose';
import { Visibilities } from '../utils/helpers.js';
const playlistSchema = new mongoose.Schema({
  description: {
    type: String,
    required: [true, 'Please provide playlist description'],
  },
  liked_users: [
    {
      _id: false,
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
  liked_artists: [
    {
      _id: false,
      artistId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Artist',
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
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Song',
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
  likes: {
    type: Number,
    required: false,
    get: function () {
      const totalLikesByUsers = this.liked_users.length;
      const totalLikesByArtists = this.liked_artists.length;
      return totalLikesByUsers + totalLikesByArtists;
    },
  },
  created_date: {
    type: Date,
    default: Date.now,
  },
  cover_image_url: {
    type: mongoose.Schema.ObjectId,
    required: false,
  },
});

const Playlist = mongoose.model('Playlist', playlistSchema);
export default Playlist;
