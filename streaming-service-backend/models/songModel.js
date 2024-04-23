import mongoose from "mongoose";
import {MusicGenres} from '../utils/helpers.js'
const songSchema = new mongoose.Schema({
  album: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Album",
  },
  artists: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Artist",
    },
  ],
  duration: {
    type: Number,
    required: [true, "Please provide duration in seconds"],
  },
  title: {
    type: String,
    required: [true, "Please provide song title"],
  },
  likes: {
    type: Number,
    required: false,
  },
  song_url: {
    type: String,
    required: [true, "Please provide song URL"],
  },
  cover_image_url: {
    type: String,
    required: [true, "Please provide song URL"],
  },
  writtenBy: {
    type: String,
    required: [true, "Please provide writer name"],
  },
  producers: {
    type: [String],
    required: [true, "Please provide producer names"],
  },
  language: {
    type: String,
    required: false,
  },
  genre: {
    type: String,
    required: [true, "Please provide genre"],
    enum: {
      values: MusicGenres,
      message: "Invalid genre for song",
    },
  },
  lyrics: {
    type: String,
    required: false,
  },
  release_date: {
    type: Date,
    required: [true, "Please provide release date"],
  },
});

const Song = mongoose.model("Song", songSchema);
export default Song;
