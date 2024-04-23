import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/userModel.js";
import Artist from "../models/artistModel.js";
import Album from "../models/albumModel.js";
import Song from "../models/songModel.js";
import ListeningHistory from "../models/listeningHistoryModel.js";
import Playlist from "../models/playlistModel.js";

await mongoose.connect("mongodb://localhost:27017/streaming-service", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const users = [
  {
    first_name: "John",
    last_name: "Doe",
    display_name: "johndoe",
    email: "john@example.com",
    password: "Password123$",
    date_of_birth: "01/01/1990",
    gender: "MALE",
    profile_image_url: "https://example.com/johndoe.jpg",
  },
  {
    first_name: "Jane",
    last_name: "Doe",
    display_name: "janedoe",
    email: "jane@example.com",
    password: "Password456$",
    date_of_birth: "01/01/1995",
    gender: "FEMALE",
    profile_image_url: "https://example.com/janedoe.jpg",
  },
];

const artists = [
  {
    first_name: "Bob",
    last_name: "Marley",
    display_name: "Marley",
    email: "bob@example.com",
    password: "Password456#",
    date_of_birth: "01/01/1940",
    gender: "MALE",
    profile_image_url: "https://example.com/bobmarley.jpg",
    genres: ["REGGAE"],
  },
  {
    first_name: "Adele",
    last_name: "Adkins",
    display_name: "Adele",
    email: "adele@example.com",
    password: "Password456@",
    date_of_birth: "01/01/1980",
    gender: "FEMALE",
    profile_image_url: "https://example.com/adele.jpg",
    genres: ["POP", "SOUL"],
  },
];

const albums = [
  {
    album_type: "ALBUM",
    total_songs: 10,
    cover_image_url: "https://example.com/album1.jpg",
    title: "Greatest Hits",
    description: "Best hits of all time",
    release_date: new Date("2020-01-01"),
    artists: [],
    songs: [],
    genres: ["POP", "ROCK"],
    likes: 100,
    total_duration: 3600,
    visibility: "PUBLIC",
  },
  {
    album_type: "SINGLE",
    total_songs: 1,
    cover_image_url: "https://example.com/album2.jpg",
    title: "Single Track",
    description: "A single track",
    release_date: new Date("2021-05-01"),
    artists: [],
    songs: [],
    genres: ["POP"],
    likes: 50,
    total_duration: 180,
    visibility: "PUBLIC",
  },
];

const songs = [
  {
    album: null,
    artists: [],
    duration: 180,
    title: "Song 1",
    likes: 20,
    song_url: "https://example.com/song1.mp3",
    cover_image_url: "https://example.com/song1.jpg",
    writtenBy: "Songwriter 1",
    producers: ["Producer 1", "Producer 2"],
    language: "English",
    genre: "POP",
    lyrics: "Lyrics for song 1",
    release_date: new Date("2020-01-01"),
  },
  {
    album: null,
    artists: [],
    duration: 240,
    title: "Song 2",
    likes: 30,
    song_url: "https://example.com/song2.mp3",
    cover_image_url: "https://example.com/song2.jpg",
    writtenBy: "Songwriter 2",
    producers: ["Producer 3"],
    language: "English",
    genre: "ROCK",
    lyrics: "Lyrics for song 2",
    release_date: new Date("2021-01-01"),
  },
];

const listeningHistory = [
  {
    userId: null,
    songId: null,
    timestamp: new Date("2023-01-01"),
  },
  {
    userId: null,
    songId: null,
    timestamp: new Date("2023-02-01"),
  },
];

const playlists = [
  {
    description: "Playlist 1",
    liked_users: [],
    title: "Playlist 1",
    owner: null,
    songs: [],
    visibility: "PUBLIC",
  },
  {
    description: "Playlist 2",
    liked_users: [],
    title: "Playlist 2",
    owner: null,
    songs: [],
    visibility: "PRIVATE",
  },
];

async function seed() {
  try {
    await User.deleteMany({});
    await Artist.deleteMany({});
    await Album.deleteMany({});
    await Song.deleteMany({});
    await ListeningHistory.deleteMany({});
    await Playlist.deleteMany({});

    const createdUsers = await User.create(users);
    const createdArtists = await Artist.create(artists);

    for (let album of albums) {
      album.artists = createdArtists.map((artist) => artist._id);
    }

    for (let song of songs) {
      song.artists = createdArtists.map((artist) => artist._id);
    }

    const createdAlbums = await Album.create(albums);

    for (let song of songs) {
      song.album =
        createdAlbums[Math.floor(Math.random() * createdAlbums.length)]._id;
    }

    const createdSongs = await Song.create(songs);

    for (let playlist of playlists) {
      playlist.songs = createdSongs.map((song) => song._id);
    }

    for (let playlist of playlists) {
      playlist.liked_users = createdUsers.map((user) => user._id);
    }

    for (let history of listeningHistory) {
      history.userId =
        createdUsers[Math.floor(Math.random() * createdUsers.length)]._id;
      history.songId =
        createdSongs[Math.floor(Math.random() * createdSongs.length)]._id;
    }

    for (let album of albums) {
      album.artists = createdArtists.map((artist) => artist._id);
    }

    for (let song of songs) {
      song.artists = createdArtists.map((artist) => artist._id);
    }

    await Playlist.create(playlists);
    await ListeningHistory.create(listeningHistory);
    await Album.create(albums);
    await Song.create(songs);

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    mongoose.connection.close();
  }
}

await seed();
