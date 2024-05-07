import mongoose from 'mongoose';
import { AlbumTypes, MusicGenres, Visibilities } from '../utils/helpers.js';

const albumSchema = new mongoose.Schema({
  album_type: {
    type: String,
    required: [true, 'Please provide an album type'],
    enum: {
      values: AlbumTypes,
      message: 'Invalid album type',
    },
  },
  total_songs: {
    type: Number,
    required: false,
    get: function () {
      return this.songs.length;
    },
  },
  cover_image_url: {
    type: mongoose.Schema.ObjectId,
    required: false,
  },
  title: {
    type: String,
    required: [true, 'Please provide an album title'],
  },
  description: {
    type: String,
    required: [true, 'Please provide an album description'],
  },
  release_date: {
    type: Date,
    required: [true, 'Please provide release date'],
  },
  created_date: {
    type: Date,
    default: Date.now,
  },
  last_updated: {
    type: Date,
    default: Date.now,
  },
  artists: [
    {
      artistId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Artist',
      },
    },
  ],
  songs: [
    {
      songId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Song',
      },
    },
  ],
  genres: {
    type: [String],
    required: [true, 'Please provide genres'],
    enum: {
      values: MusicGenres,
      message: 'Invalid music genre',
    },
  },
  likes: {
    type: Number,
    required: false,
    get: function () {
      const totalLikesByUsers = this.liked_by.users.length;
      const totalLikesByArtists = this.liked_by.artists.length;
      return totalLikesByUsers + totalLikesByArtists;
    },
  },
  liked_by: {
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
  total_duration: {
    type: Number,
    required: false,
  },
  visibility: {
    type: String,
    required: [true, 'Please provide an album visibility'],
    enum: {
      values: Visibilities,
      message: 'Invalid album visibility type',
    },
  },
});

const Album = mongoose.model('Album', albumSchema);
export default Album;
