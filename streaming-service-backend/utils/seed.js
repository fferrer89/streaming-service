import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Admin from '../models/adminModel.js';
import User from '../models/userModel.js';
import Artist from '../models/artistModel.js';
import Album from '../models/albumModel.js';
import Song from '../models/songModel.js';
import ListeningHistory from '../models/listeningHistoryModel.js';
import Playlist from '../models/playlistModel.js';
import Image from '../models/imageModel.js';
import mongo from 'mongodb';
import Grid from 'gridfs-stream';
import fs from 'fs';
import { Readable } from 'stream';
import { MusicGenres } from './helpers.js';
import axios from 'axios';

import SongFile from '../models/songFileModel.js';

await mongoose.connect(
  'mongodb+srv://user554:BHVTeZOx80QQM7jY@cluster0.bui7i1e.mongodb.net/streaming-service',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db);
const uploadSong = async (filePath, albumTitle, songTitle) => {
  try {
    filePath = `${filePath}/${songTitle}.mp3`.replaceAll(' ', '_');
    const readableStream = fs.createReadStream(filePath);

    const uploadStream = bucket.openUploadStream(songTitle);

    readableStream.pipe(uploadStream);

    uploadStream.on('error', (error) => {
      console.error('Error uploading track:', error);
      throw error;
    });

    return new Promise((resolve, reject) => {
      uploadStream.on('finish', () => {
        console.log('File uploaded successfully with ID:', uploadStream.id);
        resolve(uploadStream.id);
      });

      uploadStream.on('error', (error) => {
        console.error('Error uploading track:', error);
        reject(error);
      });
    });
  } catch (error) {
    console.error('Error uploading track:', error);
    throw error;
  }
};

const uploadRandomImage = async () => {
  try {
    const response = await axios.get('https://picsum.photos/800', {
      responseType: 'stream',
    });

    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db);
    const uploadStream = bucket.openUploadStream('randomImage.jpg');
    const fileId = uploadStream.id;

    response.data.pipe(uploadStream);

    uploadStream.on('error', (error) => {
      console.error('Error uploading image:', error);
      throw error;
    });

    return new Promise((resolve, reject) => {
      uploadStream.on('finish', async () => {
        const image = new Image({
          filename: 'randomImage.jpg',
          fileId: fileId,
          contentType: 'image/jpeg',
        });

        await image.save();

        console.log('Image uploaded successfully with ID:', image._id);
        resolve(image._id);
      });

      uploadStream.on('error', (error) => {
        console.error('Error uploading image:', error);
        reject(error);
      });
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

const admin = {
  first_name: 'Han',
  last_name: 'Solo',
  email: 'hansolo@example.com',
  password: 'HanSolo@1234',
};

const users = [
  {
    first_name: 'John',
    last_name: 'Doe',
    display_name: 'johndoe',
    email: 'john@example.com',
    password: 'Password123$',
    date_of_birth: '01/01/1990',
    gender: 'MALE',
    profile_image_url: new mongoose.Types.ObjectId(),
  },
  {
    first_name: 'Jane',
    last_name: 'Doe',
    display_name: 'janedoe',
    email: 'jane@example.com',
    password: 'Password456$',
    date_of_birth: '01/01/1995',
    gender: 'FEMALE',
    profile_image_url: new mongoose.Types.ObjectId(),
  },

  {
    first_name: 'Alice',
    last_name: 'Smith',
    display_name: 'alicesmith',
    email: 'alice@example.com',
    password: 'Password789$',
    date_of_birth: '01/01/1988',
    gender: 'FEMALE',
    profile_image_url: new mongoose.Types.ObjectId(),
  },
  {
    first_name: 'Bob',
    last_name: 'Johnson',
    display_name: 'bobjohnson',
    email: 'bob@example.com',
    password: 'Password000$',
    date_of_birth: '01/01/1992',
    gender: 'MALE',
    profile_image_url: new mongoose.Types.ObjectId(),
  },
];

const artists = [
  {
    first_name: 'Bob',
    last_name: 'Marley',
    display_name: 'Marley',
    email: 'bob@example.com',
    password: 'Password456#',
    date_of_birth: '01/01/1940',
    gender: 'MALE',
    profile_image_url: new mongoose.Types.ObjectId(),
    genres: ['REGGAE'],
  },
  {
    first_name: 'Adele',
    last_name: 'Adkins',
    display_name: 'Adele',
    email: 'adele@example.com',
    password: 'Password456@',
    date_of_birth: '01/01/1980',
    gender: 'FEMALE',
    profile_image_url: new mongoose.Types.ObjectId(),
    genres: ['POP', 'SOUL'],
  },
];

const SmithMr = {
  first_name: 'Smith',
  last_name: 'Mr',
  display_name: 'Mr Smith',
  email: 'smith@example.com',
  password: 'Password4123#',
  date_of_birth: '01/01/1940',
  gender: 'MALE',
  genres: ['COUNTRY'],
};

const BillHobson = {
  first_name: 'Bill',
  last_name: 'Hobson',
  display_name: 'Bill Hobson',
  email: 'bill@example.com',
  password: 'Password123#',
  date_of_birth: '01/01/1980',
  gender: 'MALE',
  genres: ['ROCK'],
  profile_image_url: new mongoose.Types.ObjectId(),
};

const JohnDoe = {
  first_name: 'John',
  last_name: 'Doe',
  display_name: 'POPSTAR',
  email: 'john@example.com',
  password: 'Password123#',
  date_of_birth: '01/01/1990',
  gender: 'MALE',
  genres: ['POP'],
  profile_image_url: new mongoose.Types.ObjectId(),
};

const AldousIchnite = {
  first_name: 'Aldous',
  last_name: 'Ichnite',
  display_name: 'Aldous Ichnite',
  email: 'aldous@example.com',
  password: 'Password123#',
  date_of_birth: '01/01/1999',
  gender: 'MALE',
  genres: ['ELECTRONIC'],
  profile_image_url: new mongoose.Types.ObjectId(),
};

const DanaSchechter = {
  first_name: 'Dana',
  last_name: 'Schechter',
  display_name: 'Dana Schechter',
  email: 'dana@example.com',
  password: 'Password123#',
  date_of_birth: '01/01/1999',
  gender: 'FEMALE',
  genres: ['INDIE_POP'],
  profile_image_url: new mongoose.Types.ObjectId(),
};

const MiamiSlice = {
  first_name: 'Miami',
  last_name: 'Slice',
  display_name: 'Miami Slice',
  email: 'miami@example.com',
  password: 'Password123#',
  date_of_birth: '01/01/2001',
  gender: 'FEMALE',
  genres: ['DISCO', 'HOUSE', 'DANCE'],
  profile_image_url: new mongoose.Types.ObjectId(),
};

const TripleHere = {
  first_name: 'Triple',
  last_name: 'Here',
  display_name: 'Triple5 Here',
  email: 'triple@example.com',
  password: 'Password123#',
  date_of_birth: '01/01/2001',
  gender: 'MALE',
  genres: ['SYNTH_POP', 'TRIP_HOP'],
  profile_image_url: new mongoose.Types.ObjectId(),
};

const KetsaMia = {
  first_name: 'Ketsa',
  last_name: 'Mia',
  display_name: 'Ketsa Mia',
  email: 'ketsa@example.com',
  password: 'Password123#',
  date_of_birth: '01/01/1980',
  gender: 'FEMALE',
  genres: ['SYNTH_POP', 'HIP_HOP'],
  profile_image_url: new mongoose.Types.ObjectId(),
};

const AudioKofee = {
  first_name: 'Audio',
  last_name: 'Kofee',
  display_name: 'Audio Kofee',
  email: 'audio@example.com',
  password: 'Password123#',
  date_of_birth: '01/01/1990',
  gender: 'MALE',
  genres: ['ELECTRONIC', 'SYNTH_POP'],
  profile_image_url: new mongoose.Types.ObjectId(),
};

const johnAlbum = {
  album_type: 'SINGLE',
  title: 'Girlseeker',
  description: 'A single track',
  release_date: new Date('2012-05-01'),
  artists: [],
  songs: [],
  genres: ['POP'],
  visibility: 'PUBLIC',
};

const smithAlbum = {
  album_type: 'ALBUM',
  title: 'A New Roar',
  description: 'Album',
  release_date: new Date('2042-03-02'),
  artists: [],
  songs: [],
  genres: ['COUNTRY'],
  visibility: 'PUBLIC',
};

const billAlbum = {
  album_type: 'ALBUM',
  title: 'Killdozer',
  description: 'Album',
  release_date: new Date('2012-05-01'),
  artists: [],
  songs: [],
  genres: ['ROCK'],
  visibility: 'PUBLIC',
};

const aldousAlbum = {
  album_type: 'ALBUM',
  title: 'Fear of Getting Out',
  description: 'Album desc',
  release_date: new Date('2024-04-29'),
  artists: [],
  songs: [],
  genres: ['ELECTRONIC'],
  visibility: 'PUBLIC',
};

const miamiAlbum = {
  album_type: 'ALBUM',
  title: 'Brooklyn To Brooklyn',
  description: 'Album desc',
  release_date: new Date('2014-11-19'),
  artists: [],
  songs: [],
  genres: ['DISCO', 'HOUSE', 'DANCE'],
  visibility: 'PUBLIC',
};

const danaAlbum = {
  album_type: 'ALBUM',
  title: 'Bee And Flower',
  description: 'Album desc',
  release_date: new Date('2012-11-19'),
  artists: [],
  songs: [],
  genres: ['INDIE_POP'],
  visibility: 'PUBLIC',
};

const tripleAlbum = {
  album_type: 'ALBUM',
  title: 'Mellow Fellow',
  description: 'Album desc',
  release_date: new Date('2024-04-19'),
  artists: [],
  songs: [],
  genres: ['SYNTH_POP', 'TRIP_HOP'],
  visibility: 'PUBLIC',
};

const ketsaAlbum = {
  album_type: 'ALBUM',
  title: 'Fresh Starts',
  description: 'Album desc',
  release_date: new Date('2023-12-19'),
  artists: [],
  songs: [],
  genres: ['SYNTH_POP', 'HIP_HOP'],
  visibility: 'PUBLIC',
};

const audioAlbum = {
  album_type: 'ALBUM',
  title: 'Sad Mood',
  description: 'Album desc',
  release_date: new Date('2022-11-19'),
  artists: [],
  songs: [],
  genres: ['ELECTRONIC', 'SYNTH_POP'],
  visibility: 'PUBLIC',
};

const albums = [
  {
    album_type: 'ALBUM',
    cover_image_url: new mongoose.Types.ObjectId(),
    title: 'Greatest Hits',
    description: 'Best hits of all time',
    release_date: new Date('2020-01-01'),
    artists: [],
    songs: [],
    genres: ['POP', 'ROCK'],
    total_duration: 3600,
    visibility: 'PUBLIC',
  },
  {
    album_type: 'SINGLE',
    cover_image_url: new mongoose.Types.ObjectId(),
    title: 'Single Track',
    description: 'A single track',
    release_date: new Date('2021-05-01'),
    artists: [],
    songs: [],
    genres: ['POP'],
    total_duration: 180,
    visibility: 'PUBLIC',
  },
];

const songs = [
  {
    album: null,
    artists: [],
    duration: 180,
    title: 'Song',
    likes: 20,
    song_url: new mongoose.Types.ObjectId(),
    cover_image_url: new mongoose.Types.ObjectId(),
    writtenBy: 'Songwriter',
    producers: ['Producer', 'Producer'],
    language: 'English',
    genre: 'POP',
    lyrics: 'Lyrics for song 1',
    release_date: new Date('2020-01-01'),
  },
  {
    album: null,
    artists: [],
    duration: 240,
    title: 'Songg',
    likes: 30,
    song_url: new mongoose.Types.ObjectId(),
    cover_image_url: new mongoose.Types.ObjectId(),
    writtenBy: 'Songwriter',
    producers: ['Producer'],
    language: 'English',
    genre: 'ROCK',
    lyrics: 'Lyrics for song 2',
    release_date: new Date('2021-01-01'),
  },
  {
    album: null,
    artists: [],
    duration: 180,
    title: 'dare',
    likes: 20,
    song_url: new mongoose.Types.ObjectId(),
    cover_image_url: new mongoose.Types.ObjectId(),
    writtenBy: 'Songwriter',
    producers: ['Producer', 'Producer'],
    language: 'English',
    genre: 'POP',
    lyrics: 'Lyrics for song 1',
    release_date: new Date('2020-01-01'),
  },
  {
    album: null,
    artists: [],
    duration: 240,
    title: 'white',
    likes: 30,
    song_url: new mongoose.Types.ObjectId(),
    cover_image_url: new mongoose.Types.ObjectId(),
    writtenBy: 'Songwriter',
    producers: ['Producer'],
    language: 'English',
    genre: 'ROCK',
    lyrics: 'Lyrics for song 2',
    release_date: new Date('2021-01-01'),
  },
];

const smithSongs = [
  {
    album: null,
    artists: ['Mr Smith'],
    title: 'Dead Zone',
    writtenBy: 'John Doe',
    producers: ['Jane Smith', 'Michael Johnson'],
    language: 'English',
    genre: MusicGenres[Math.floor(Math.random() * MusicGenres.length)],
    release_date: new Date('2020-01-01'),
  },
  {
    album: null,
    artists: ['Mr Smith'],
    title: 'Peaceful',
    writtenBy: 'Alice Johnson',
    producers: ['David Brown'],
    language: 'English',
    genre: MusicGenres[Math.floor(Math.random() * MusicGenres.length)],
    release_date: new Date('2020-02-15'),
  },
  {
    album: null,
    artists: ['Mr Smith'],
    title: 'Going Home',
    writtenBy: 'Bob White',
    producers: ['Mary Johnson', 'Tom Brown'],
    language: 'English',
    genre: MusicGenres[Math.floor(Math.random() * MusicGenres.length)],
    release_date: new Date('2020-03-20'),
  },
  {
    album: null,
    artists: ['Mr Smith'],
    title: 'Slingshot',
    writtenBy: 'Sarah Davis',
    producers: ['Jack Thompson'],
    language: 'English',
    genre: MusicGenres[Math.floor(Math.random() * MusicGenres.length)],
    release_date: new Date('2020-04-10'),
  },
  {
    album: null,
    artists: ['Mr Smith'],
    title: 'Hard Time',
    writtenBy: 'Emily Brown',
    producers: ['Harry Smith'],
    language: 'English',
    genre: MusicGenres[Math.floor(Math.random() * MusicGenres.length)],
    release_date: new Date('2020-05-05'),
  },
  {
    album: null,
    artists: ['Mr Smith'],
    title: 'Two Step Daisy Duke',
    writtenBy: 'Olivia Taylor',
    producers: ['Daniel Wilson'],
    language: 'English',
    genre: MusicGenres[Math.floor(Math.random() * MusicGenres.length)],
    release_date: new Date('2020-06-20'),
  },
  {
    album: null,
    artists: ['Mr Smith'],
    title: 'Hayley',
    writtenBy: 'Lucas Adams',
    producers: ['Sophia Evans'],
    language: 'English',
    genre: MusicGenres[Math.floor(Math.random() * MusicGenres.length)],
    release_date: new Date('2020-07-15'),
  },
  {
    album: null,
    artists: ['Mr Smith'],
    title: 'Mindsweep',
    writtenBy: 'Noah Harris',
    producers: ['Emma Thompson'],
    language: 'English',
    genre: MusicGenres[Math.floor(Math.random() * MusicGenres.length)],
    release_date: new Date('2020-08-10'),
  },
];

const aldousSongs = [
  {
    album: null,
    artists: ['Aldous Ichnite'],
    title: 'The Locks Change',
    writtenBy: 'John Doe',
    producers: ['Jane Smith'],
    language: 'English',
    genre: MusicGenres[Math.floor(Math.random() * MusicGenres.length)],
    release_date: new Date('2020-01-01'),
  },
  {
    album: null,
    artists: ['Aldous Ichnite'],
    title: 'Fear of Getting Out',
    writtenBy: 'Alice Johnson',
    producers: ['David Brown'],
    language: 'English',
    genre: MusicGenres[Math.floor(Math.random() * MusicGenres.length)],
    release_date: new Date('2020-02-15'),
  },
  {
    album: null,
    artists: ['Aldous Ichnite'],
    title: 'Flickering By the Fire Escape',
    writtenBy: 'Bob White',
    producers: ['Mary Johnson'],
    language: 'English',
    genre: MusicGenres[Math.floor(Math.random() * MusicGenres.length)],
    release_date: new Date('2020-03-20'),
  },
];

const billSongs = [
  {
    album: null,
    artists: ['Bill Hobson'],
    title: 'Gates Of Heaven',
    writtenBy: 'John Doe',
    producers: ['Jane Smith'],
    language: 'English',
    genre: MusicGenres[Math.floor(Math.random() * MusicGenres.length)],
    release_date: new Date('2020-01-01'),
  },
  {
    album: null,
    artists: ['Bill Hobson'],
    title: 'Sweet Home Alabama',
    writtenBy: 'Alice Johnson',
    producers: ['David Brown'],
    language: 'English',
    genre: MusicGenres[Math.floor(Math.random() * MusicGenres.length)],
    release_date: new Date('2020-02-15'),
  },
];

const danaSongs = [
  {
    album: null,
    artists: ['Dana Schechter'],
    title: 'I Know Your Name',
    writtenBy: 'John Doe',
    producers: ['Jane Smith'],
    language: 'English',
    genre: MusicGenres[Math.floor(Math.random() * MusicGenres.length)],
    release_date: new Date('2020-01-01'),
  },
  {
    album: null,
    artists: ['Dana Schechter'],
    title: 'Swallow Your Stars',
    writtenBy: 'Alice Johnson',
    producers: ['David Brown'],
    language: 'English',
    genre: MusicGenres[Math.floor(Math.random() * MusicGenres.length)],
    release_date: new Date('2020-02-15'),
  },
  {
    album: null,
    artists: ['Dana Schechter'],
    title: "It's The Rain",
    writtenBy: 'Bob White',
    producers: ['Mary Johnson'],
    language: 'English',
    genre: MusicGenres[Math.floor(Math.random() * MusicGenres.length)],
    release_date: new Date('2020-03-20'),
  },
  {
    album: null,
    artists: ['Dana Schechter'],
    title: 'Jackson',
    writtenBy: 'Sarah Davis',
    producers: ['Jack Thompson'],
    language: 'English',
    genre: MusicGenres[Math.floor(Math.random() * MusicGenres.length)],
    release_date: new Date('2020-04-10'),
  },
];

const ketsaSongs = [
  {
    album: null,
    artists: ['Ketsa Mia'],
    title: 'Catch My Drift',
    writtenBy: 'John Doe',
    producers: ['Jane Smith'],
    language: 'English',
    genre: MusicGenres[Math.floor(Math.random() * MusicGenres.length)],
    release_date: new Date('2020-01-01'),
  },
  {
    album: null,
    artists: ['Ketsa Mia'],
    title: 'Fresh Starts',
    writtenBy: 'Alice Johnson',
    producers: ['David Brown'],
    language: 'English',
    genre: MusicGenres[Math.floor(Math.random() * MusicGenres.length)],
    release_date: new Date('2020-02-15'),
  },
  {
    album: null,
    artists: ['Ketsa Mia'],
    title: 'Effort',
    writtenBy: 'Bob White',
    producers: ['Mary Johnson'],
    language: 'English',
    genre: MusicGenres[Math.floor(Math.random() * MusicGenres.length)],
    release_date: new Date('2020-03-20'),
  },
  {
    album: null,
    artists: ['Ketsa Mia'],
    title: 'Eventually',
    writtenBy: 'Sarah Davis',
    producers: ['Jack Thompson'],
    language: 'English',
    genre: MusicGenres[Math.floor(Math.random() * MusicGenres.length)],
    release_date: new Date('2020-04-10'),
  },
];

const tripleSongs = [
  {
    album: null,
    artists: ['Triple'],
    title: 'Vim and Vinagarette Remastered',
    writtenBy: 'John Doe',
    producers: ['Jane Smith'],
    language: 'English',
    genre: MusicGenres[Math.floor(Math.random() * MusicGenres.length)],
    release_date: new Date('2020-01-01'),
  },
];

const johnSongs = [
  {
    album: null,
    artists: ['Triple'],
    title: 'Dream',
    writtenBy: 'John Doe',
    producers: ['Jane Smith'],
    language: 'English',
    genre: MusicGenres[Math.floor(Math.random() * MusicGenres.length)],
    release_date: new Date('2020-01-01'),
  },
];

const miamiSongs = [
  {
    album: null,
    artists: ['Miami Slice'],
    title: 'Beach Life',
    writtenBy: 'John Doe',
    producers: ['Jane Smith'],
    language: 'English',
    genre: MusicGenres[Math.floor(Math.random() * MusicGenres.length)],
    release_date: new Date('2020-01-01'),
  },
  {
    album: null,
    artists: ['Miami Slice'],
    title: 'Solid Gold',
    writtenBy: 'Alice Johnson',
    producers: ['David Brown'],
    language: 'English',
    genre: MusicGenres[Math.floor(Math.random() * MusicGenres.length)],
    release_date: new Date('2020-02-15'),
  },
  {
    album: null,
    artists: ['Miami Slice'],
    title: 'Feel The Beat',
    writtenBy: 'Bob White',
    producers: ['Mary Johnson'],
    language: 'English',
    genre: MusicGenres[Math.floor(Math.random() * MusicGenres.length)],
    release_date: new Date('2020-03-20'),
  },
  {
    album: null,
    artists: ['Miami Slice'],
    title: 'Good News',
    writtenBy: 'Sarah Davis',
    producers: ['Jack Thompson'],
    language: 'English',
    genre: MusicGenres[Math.floor(Math.random() * MusicGenres.length)],
    release_date: new Date('2020-04-10'),
  },
];

const audioSongs = [
  {
    album: null,
    artists: ['Audio Kofee'],
    title: 'Atmospheric Sad Beat',
    writtenBy: 'John Doe',
    producers: ['Jane Smith'],
    language: 'English',
    genre: MusicGenres[Math.floor(Math.random() * MusicGenres.length)],
    release_date: new Date('2020-01-01'),
  },
  {
    album: null,
    artists: ['Audio Kofee'],
    title: 'Digital Piano Technology',
    writtenBy: 'Alice Johnson',
    producers: ['David Brown'],
    language: 'English',
    genre: MusicGenres[Math.floor(Math.random() * MusicGenres.length)],
    release_date: new Date('2020-02-15'),
  },
  {
    album: null,
    artists: ['Audio Kofee'],
    title: 'Sad Dramatic Time',
    writtenBy: 'Bob White',
    producers: ['Mary Johnson'],
    language: 'English',
    genre: MusicGenres[Math.floor(Math.random() * MusicGenres.length)],
    release_date: new Date('2020-03-20'),
  },
  {
    album: null,
    artists: ['Audio Kofee'],
    title: 'Sad Tension',
    writtenBy: 'Sarah Davis',
    producers: ['Jack Thompson'],
    language: 'English',
    genre: MusicGenres[Math.floor(Math.random() * MusicGenres.length)],
    release_date: new Date('2020-04-10'),
  },
  {
    album: null,
    artists: ['Audio Kofee'],
    title: 'Warm Abstraction',
    writtenBy: 'Mike Adams',
    producers: ['Emily Wilson'],
    language: 'English',
    genre: MusicGenres[Math.floor(Math.random() * MusicGenres.length)],
    release_date: new Date('2020-05-25'),
  },
];

const listeningHistory = [
  {
    userId: null,
    songId: null,
    timestamp: new Date('2023-01-01'),
  },
  {
    userId: null,
    songId: null,
    timestamp: new Date('2023-02-01'),
  },
];

const playlists = [
  {
    description: 'Playlist 1',
    liked_users: [],
    title: 'Playlist 1',
    owner: null, // Assign the first user as the owner
    songs: [],
    visibility: 'PUBLIC',
  },
  {
    description: 'Playlist 2',
    liked_users: [],
    title: 'Playlist 2',
    owner: null, // Assign the second user as the owner
    songs: [],
    visibility: 'PRIVATE',
  },
];

let customData = [
  {
    artist: SmithMr,
    album: smithAlbum,
    songs: smithSongs,
  },
  {
    artist: BillHobson,
    album: billAlbum,
    songs: billSongs,
  },
  {
    artist: JohnDoe,
    album: johnAlbum,
    songs: johnSongs,
  },
  {
    artist: AldousIchnite,
    album: aldousAlbum,
    songs: aldousSongs,
  },
  {
    artist: DanaSchechter,
    album: danaAlbum,
    songs: danaSongs,
  },
  {
    artist: MiamiSlice,
    album: miamiAlbum,
    songs: miamiSongs,
  },
  {
    artist: TripleHere,
    album: tripleAlbum,
    songs: tripleSongs,
  },
  {
    artist: KetsaMia,
    album: ketsaAlbum,
    songs: ketsaSongs,
  },
  {
    artist: AudioKofee,
    album: audioAlbum,
    songs: audioSongs,
  },
];

async function seed() {
  try {
    console.log(
      '------------------------  Strated Clearing Current Database  -------------------------'
    );
    await Admin.deleteMany({});
    await User.deleteMany({});
    await Artist.deleteMany({});
    await Album.deleteMany({});
    await Song.deleteMany({});
    await ListeningHistory.deleteMany({});
    await Playlist.deleteMany({});
    await Image.deleteMany({});

    const filesCollection = mongoose.connection.db.collection('fs.files');
    await filesCollection.deleteMany({});
    const filesChunksCollection =
      mongoose.connection.db.collection('fs.chunks');
    await filesChunksCollection.deleteMany({});
    await SongFile.deleteMany({});

    console.log(
      '------------------------  Inserting Sample Images  -------------------------'
    );
    const sampleAlbumImageId = await uploadSong(
      `./utils/img`,
      null,
      'album-icon.jpeg'
    );
    const sampleSongImageId = await uploadSong(
      `./utils/img`,
      null,
      'music_note.jpeg'
    );
    const sampleArtistImageId = await uploadSong(
      `./utils/img`,
      null,
      'artist-icon.jpeg'
    );
    const sampleUserImageId = await uploadSong(
      `./utils/img`,
      null,
      'user.jpeg'
    );
    console.log(`Sample songs image: ${sampleSongImageId}`);
    console.log(`Sample album image: ${sampleAlbumImageId}`);
    console.log(`Sample artist image: ${sampleArtistImageId}`);
    console.log(`Sample user image: ${sampleUserImageId}`);

    await SongFile.create({
      filename: 'sample_user_image',
      mimetype: 'image/jpeg',
      uploadDate: new Date(),
      fileId: sampleUserImageId,
    });
    await SongFile.create({
      filename: 'sample_artist_image',
      mimetype: 'image/jpeg',
      uploadDate: new Date(),
      fileId: sampleArtistImageId,
    });
    await SongFile.create({
      filename: 'sample_album_image',
      mimetype: 'image/jpeg',
      uploadDate: new Date(),
      fileId: sampleAlbumImageId,
    });
    await SongFile.create({
      filename: 'sample_song_image',
      mimetype: 'image/jpeg',
      uploadDate: new Date(),
      fileId: sampleSongImageId,
    });

    console.log(
      '------------------------  Inserting dummy Data without song files  -------------------------'
    );
    const createAdmin = await Admin.create(admin);
    const newUsers = users.map((user) => ({
      ...user,
      profile_image_url: new mongoose.Types.ObjectId(sampleUserImageId),
    }));
    const createdUsers = await User.create(newUsers);
    const newArtists = artists.map((artist) => ({
      ...artist,
      profile_image_url: new mongoose.Types.ObjectId(sampleArtistImageId),
    }));
    const createdArtists = await Artist.create(newArtists);

    for (let artist of createdArtists) {
      const imageId = await uploadRandomImage();
      artist.profile_image_url = imageId;
      await artist.save();
    }
    for (let user of createdUsers) {
      const imageId = await uploadRandomImage();
      user.profile_image_url = imageId;
      await user.save();
    }

    const albumsWithArtists = albums.map((album) => ({
      ...album,
      artists: createdArtists.map((artist) => ({ artistId: artist._id })),
      cover_image_url: new mongoose.Types.ObjectId(sampleAlbumImageId),
    }));

    for (let song of songs) {
      song.artists = createdArtists.map((artist) => artist._id);
    }

    const createdAlbums = await Album.create(albumsWithArtists);

    const songsWithAlbumsAndArtists = songs.map((song) => ({
      ...song,
      album:
        createdAlbums[Math.floor(Math.random() * createdAlbums.length)]._id,
      cover_image_url: new mongoose.Types.ObjectId(sampleSongImageId),
    }));

    const createdSongs = await Song.create(songsWithAlbumsAndArtists);

    for (let song of createdSongs) {
      const randomAlbumIndex = Math.floor(Math.random() * createdAlbums.length);
      song.album = createdAlbums[randomAlbumIndex]._id;
      let imageId = await uploadRandomImage();
      song.cover_image_url = imageId;
      await Song.findByIdAndUpdate(song._id, { album: song.album });
    }

    for (let album of createdAlbums) {
      const randomArtistIndex = Math.floor(
        Math.random() * createdArtists.length
      );
      album.artists = [{ artistId: createdArtists[randomArtistIndex]._id }];
      let imageId = await uploadRandomImage();
      album.cover_image_url = imageId;
      await Album.findByIdAndUpdate(album._id, { artists: album.artists });
    }

    for (let album of createdAlbums) {
      const albumSongs = createdSongs.filter((song) =>
        song.album.equals(album._id)
      );
      album.songs = {
        songId: albumSongs[Math.floor(Math.random() * albumSongs.length)]._id,
      };
      await album.save();
    }

    const albumsWithLikedBy = createdAlbums.map((album) => ({
      ...album._doc,
      liked_by: {
        users: createdUsers.map((user) => user._id),
        artists: createdArtists.map((artist) => artist._id),
      },
    }));

    await Promise.all(
      albumsWithLikedBy.map((album) =>
        Album.findByIdAndUpdate(album._id, { liked_by: album.liked_by })
      )
    );

    // Populating followers and following for artists and users
    const aids = createdArtists.map((artist) => artist._id);
    for (let currentArtist of createdArtists) {
      const otherArtists = createdArtists.filter(
        (artist) => artist._id.toString() !== currentArtist._id.toString()
      );
      const followingArtists = otherArtists.map((artist) => artist._id);
      const followingUsers = createdUsers.map((user) => user._id);
      await Artist.findByIdAndUpdate(currentArtist._id, {
        $set: {
          'following.artists': followingArtists,
          'followers.artists': followingArtists,
          'following.users': followingUsers,
          'followers.users': followingUsers,
        },
      });
    }
    for (let currentUser of createdUsers) {
      const otherUsers = createdUsers.filter(
        (user) => user._id.toString() !== currentUser._id.toString()
      );
      const followingArtists = createdArtists.map((artist) => artist._id);
      const followingUsers = otherUsers.map((user) => user._id);
      await User.findByIdAndUpdate(currentUser._id, {
        $set: {
          'following.artists': followingArtists,
          'followers.artists': followingArtists,
          'following.users': followingUsers,
          'followers.users': followingUsers,
        },
      });
    }

    for (let playlist of playlists) {
      let imageId = await uploadRandomImage();
      playlist.cover_image_url = imageId;
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
    console.log(listeningHistory);
    for (let album of albums) {
      album.artists = createdArtists.map((artist) => artist._id);
    }

    for (let song of songs) {
      song.artists = createdArtists.map((artist) => artist._id);
    }

    for (let playlist of playlists) {
      playlist.songs = createdSongs.map((song) => song._id);
      playlist.liked_users = createdUsers.map((user) => user._id);
    }

    if (createdUsers.length >= 2) {
      playlists[0].owner = createdUsers[0];
      playlists[1].owner = createdUsers[1];
    } else {
      console.error('Not enough users created to assign owners to playlists');
    }

    const createdPlaylists = await Playlist.create(playlists);

    await ListeningHistory.create(listeningHistory);
    await Album.create(albums);
    await Song.create(songs);

    console.log(
      '------------------------  Inserting custom data with song files  -------------------------'
    );
    for (let data of customData) {
      let cArtist = await Artist.create({
        ...data.artist,
        profile_image_url: new mongoose.Types.ObjectId(sampleArtistImageId),
      });

      data.album.cover_image_url = await uploadRandomImage();

      let cAlbum = await Album.create(data.album);
      cAlbum.artists = [{ artistId: cArtist._id }];
      const imageId = await uploadSong(
        `./utils/songData/${data.album.title}`,
        data.album.title,
        'download.jpeg'
      );
      cAlbum.cover_image_url = new mongoose.Types.ObjectId(imageId);

      for (let song of data.songs) {
        let songPath = `./songData/${cAlbum.title}/${song.title}.mp3`;
        console.log(`Song path : ${songPath}`);
        const songId = await uploadSong(
          `./utils/songData/${data.album.title}`,
          data.album.title,
          song.title
        );
        console.log(songId);
        song.artists = [cArtist._id];
        song.album = cAlbum._id;
        song.song_url = songId;
        song.cover_image_url = new mongoose.Types.ObjectId(imageId);
        let cSong = await Song.create(song);
        cAlbum.songs.push({ songId: cSong._id });
        await cAlbum.save();
      }
    }

    console.log(
      '------------------------  Database seeded successfully  -------------------------'
    );
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    mongoose.connection.close();
  }
}

await seed();
