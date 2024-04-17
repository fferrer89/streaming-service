import mongoose from "mongoose";

const albumSchema = new mongoose.Schema({
  album_type: {
    type: String,
    required: [true, "Please provide an album type"],
    enum: {
      values: ["album", "single", "compilation", "appears_on"],
      message: "Invalid album type",
    },
  },
  total_songs: {
    type: Number,
    required: [true, "Please provide the total tracks"],
  },
  cover_image_url: {
    type: String,
    required: [true, "Please provide image URL"],
  },
  title: {
    type: String,
    required: [true, "Please provide an album title"],
  },
  description: {
    type: String,
    required: [true, "Please provide an album description"],
  },
  release_date: {
    type: Date,
    required: [true, "Please provide release date"],
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
        ref: "Artist",
      },
    },
  ],
  songs: [
    {
      songId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Song",
      },
    },
  ],
  genres: {
    type: [String],
    required: [true, "Please provide genres"],
  },
  likes: {
    type: Number,
    required: false,
  },
  total_duration: {
    type: Number,
    required: false,
  },
  visibility: {
    type: String,
    required: [true, "Please provide an album visibility"],
    enum: {
      values: ["public", "private"],
      message: "Invalid album visibility type",
    },
  },
});

const Album = mongoose.model("Album", albumSchema);
export default Album;
