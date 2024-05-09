import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';
import Admin from '../models/adminModel.js';
import User from '../models/userModel.js';
import Artist from '../models/artistModel.js';
import Album from '../models/albumModel.js';
import Song from '../models/songModel.js';
import ListeningHistory from '../models/listeningHistoryModel.js';
import Playlist from '../models/playlistModel.js';
import { MusicGenres, Genders } from './helpers.js';
import SongFile from '../models/songFileModel.js';
import fs from 'fs';
import axios from 'axios';
import { Readable } from 'stream';
import bcrypt from 'bcryptjs';

const usersToBeSeeded = 50;
const artistsToBeSeeded = 2;
// albums number will be random from 1 to 6
const albumsToBeSeeded = Math.floor(Math.random() * 6) + 1;
// songs number will be random from 1 to 5
const numberOfSongs = Math.floor(Math.random() * 5) + 1;
//threre will 1-3 songs for each artist without linked to any albums
const numberOfSongsWithoutAlbums = Math.floor(Math.random() * 3) + 1;
const numUsersToSelect = Math.floor(Math.random() * usersToBeSeeded - 1);
const numSongsToSelect = Math.floor(
  Math.random() * (numberOfSongs * artistsToBeSeeded * albumsToBeSeeded) - 1
);
await mongoose.connect('mongodb://localhost:27017/streaming-service', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db);
const uploadImage = async (url, name) => {
  //console.log('------------------------ ', url);
  try {
    const response = await axios({
      url,
      method: 'GET',
      responseType: 'stream',
    });

    const readableStream = response.data;

    const uploadStream = bucket.openUploadStream(name);

    readableStream.pipe(uploadStream);

    uploadStream.on('error', (error) => {
      console.error('Error uploading image:', error);
      throw error;
    });

    return new Promise((resolve, reject) => {
      uploadStream.on('finish', () => {
        //console.log('Image uploaded successfully with ID:', uploadStream.id);
        resolve(uploadStream.id);
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

function generateTwoDigitRandomNumber() {
  return Math.floor(Math.random() * 100);
}

function generateTwoRandomLowercaseLetters() {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz';
  const randomLetter1 = alphabet[Math.floor(Math.random() * alphabet.length)];
  const randomLetter2 = alphabet[Math.floor(Math.random() * alphabet.length)];
  return randomLetter1 + randomLetter2;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const generateName = () => {
  const firstName = faker.person.firstName().replace(/[^a-zA-Z]/g, '');
  const lastName = faker.person.lastName().replace(/[^a-zA-Z]/g, '');
  const displayName = faker.person.fullName().replace(/[^a-zA-Z]/g, '');

  const truncatedFirstName =
    firstName.length > 20 ? firstName.substring(0, 20) : firstName;

  const truncatedLastName =
    lastName.length > 20 ? lastName.substring(0, 20) : lastName;

  const truncatedDisplayName =
    displayName.length > 20 ? displayName.substring(0, 20) : displayName;

  return {
    first_name: truncatedFirstName,
    last_name: truncatedLastName,
    display_name: truncatedDisplayName,
  };
};
console.log(
  '------------------------  Started Custom Data Generation -------------------------'
);

async function insertArtists() {
  const sampleProfileImage = await SongFile.findOne({
    filename: 'sample_artist_image',
  }).fileId;

  const artists = [];

  for (let i = 0; i < 50; i++) {
    const name = generateName();
    const fakeImagePath = faker.image.avatar();
    const fakeImageID = await uploadImage(fakeImagePath, name.first_name);
    await SongFile.create({
      filename: name.first_name,
      mimetype: 'image/jpeg',
      uploadDate: new Date(),
      fileId: fakeImageID,
    });
    const artist = new Artist({
      first_name: name.first_name,
      last_name: name.last_name,
      display_name: name.display_name,
      email: faker.internet.email(),
      password: faker.internet.password(),
      date_of_birth: faker.date
        .past({ years: 50, refDate: new Date('1974-01-01') })
        .toLocaleDateString(),
      gender: faker.helpers.arrayElement(Genders),
      profile_image_url: fakeImageID,
      genres: [faker.helpers.arrayElement(MusicGenres, 4)],
    });
    artists.push(artist);
    console.log(
      `--------------------  Processed ${
        i + 1
      }/${artistsToBeSeeded} artists  -------------------`
    );
  }
  await Artist.insertMany(artists);
}

async function insertUsers() {
  const users = [];
  const passwordHash = await bcrypt.hash('Password123$', 12);
  for (let i = 0; i < usersToBeSeeded; i++) {
    const name = generateName();
    const fakeImagePath = faker.image.avatar();
    const fakeImageID = await uploadImage(fakeImagePath, name.first_name);
    await SongFile.create({
      filename: name.first_name,
      mimetype: 'image/jpeg',
      uploadDate: new Date(),
      fileId: fakeImageID,
    });
    const user = new User({
      first_name: name.first_name,
      last_name: name.last_name,
      display_name: name.display_name,
      email: `${generateTwoRandomLowercaseLetters()}${faker.internet.email()}`,
      password: passwordHash,
      date_of_birth: faker.date
        .past({ years: 50, refDate: new Date('1974-01-01') })
        .toLocaleDateString(),
      gender: faker.helpers.arrayElement(Genders),
      profile_image_url: fakeImageID,
    });
    users.push(user);
    console.log(
      `--------------------  Processed ${
        i + 1
      }/${usersToBeSeeded} users  -------------------`
    );
  }
  const createdUser = await User.insertMany(users);
  return createdUser;
}
const languages = ['English', 'Spanish', 'Mandarin', 'Hindi', 'Arabic'];

async function generateCustomData() {
  const customData = [];

  for (let i = 0; i < artistsToBeSeeded; i++) {
    const name = generateName();
    const artist = {
      first_name: name.first_name,
      last_name: name.last_name,
      display_name: name.display_name,
      email: faker.internet.email(),
      password: 'Password123$',
      date_of_birth: faker.date
        .past({ years: 50, refDate: new Date('1974-01-01') })
        .toLocaleDateString(),
      gender: faker.helpers.arrayElement(Genders),
      genres: [faker.helpers.arrayElement(MusicGenres)],
      profile_image_url: faker.image.avatar(),
    };

    const albums = [];
    for (let j = 0; j < albumsToBeSeeded; j++) {
      const album = {
        album: {
          album_type: 'ALBUM',
          title: faker.word.sample(5),
          description: faker.lorem.sentence(),
          release_date: faker.date.past({
            years: 50,
            refDate: new Date('1980-01-01'),
          }),
          artists: [artist],
          genres: [faker.helpers.arrayElement(MusicGenres, 3)],
          visibility: faker.helpers.arrayElement(['PUBLIC', 'PRIVATE']),
          cover_image_url: faker.image.urlLoremFlickr({
            width: 250,
            height: 250,
            category: 'abstract',
          }),
        },
        songs: [],
      };

      const songImagePath = faker.image.urlLoremFlickr({
        width: 250,
        height: 250,
        category: 'abstract',
      });
      for (let k = 0; k < numberOfSongs; k++) {
        const song = {
          album: null,
          artists: [artist],
          title: faker.word.sample(5),
          writtenBy: name.first_name,
          producers: [name.first_name],
          language: faker.helpers.arrayElement(languages),
          genre: faker.helpers.arrayElement(MusicGenres),
          release_date: faker.date.past(),
          cover_image_url: songImagePath,
        };

        album.songs.push(song);
      }

      albums.push(album);
    }

    customData.push({ artist, albums });
  }

  return customData;
}

const customData = await generateCustomData();
console.log(
  '------------------------  Custom Data Generated  -------------------------'
);
//console.log(customData[0].albums[0].songs[0]);
const songIdArray = await SongFile.distinct('fileId', {
  mimetype: 'audio/mpeg',
});
let count = 1;
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

async function generatePlaylist(userId) {
  try {
    const sampleProfileImage = await SongFile.findOne({
      filename: 'sample_song_image',
    }).fileId;
    const numPlaylists = Math.floor(Math.random() * 3) + 2;

    const playlists = [];
    for (let i = 0; i < numPlaylists; i++) {
      const playlistData = {
        description: faker.word.sample(6),
        title: faker.word.sample(5),
        owner: userId,
        visibility: faker.helpers.arrayElement(['PUBLIC', 'PRIVATE']),
        likes: Math.floor(Math.random() * 100),
        created_date: new Date(),
        cover_image_url: new mongoose.Types.ObjectId(sampleProfileImage),
      };

      const randomSong = await Song.aggregate([{ $sample: { size: 1 } }]);
      const songId = randomSong[0]._id;
      playlistData.songs = [songId];

      const playlist = await Playlist.create(playlistData);
      playlists.push(playlist);
    }

    //console.log(`Generated ${numPlaylists} playlists for user ${userId}`);
  } catch (error) {
    console.error('Error generating playlists:', error);
  }
}

async function populateListeningHistory() {
  try {
    const users = await User.find();
    const songs = await Song.find();

    const numListeningHistoryRecords = 100000;

    const listeningHistoryRecords = [];
    for (let i = 0; i < numListeningHistoryRecords; i++) {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      const randomSong = songs[Math.floor(Math.random() * songs.length)];

      const listeningHistoryRecord = {
        userId: randomUser._id,
        songId: randomSong._id,
        timestamp: new Date(),
        deleted: false,
      };

      listeningHistoryRecords.push(listeningHistoryRecord);
    }

    await ListeningHistory.insertMany(listeningHistoryRecords);

    console.log('Listening history populated successfully');
  } catch (error) {
    console.error('Error populating listening history:', error);
  }
}
const createdSongIDArray = await Song.distinct('_id');
async function populateUserDatawithRemainingFields() {
  try {
    const users = await User.find();
    const artist = await Artist.find();
    for (let user of users) {
      const shuffledUsers = shuffleArray(users);
      const selectedUsers = shuffledUsers.slice(0, numUsersToSelect);
      const shuffledArtist = shuffleArray(users);
      const selectedArtist = shuffledArtist.slice(0, artistsToBeSeeded - 1);

      user.followers.users = selectedUsers.map((user) => user._id);
      user.following.users = selectedUsers.map((user) => user._id);
      user.following.artists = selectedArtist.map((artist) => artist._id);

      await user.save();
    }
    for (let user of users) {
      const shuffledSongs = shuffleArray(createdSongIDArray);
      const selectedSongs = shuffledSongs.slice(0, numSongsToSelect);

      for (let songId of selectedSongs) {
        user.liked_songs.push({
          songId: songId,
          liked_date: new Date(),
        });
      }

      await user.save();
    }

    console.log('User fields populated successfully');
  } catch (error) {
    console.error('Error populating user data:', error);
  }
}

async function seed() {
  try {
    // await insertArtists();
    // console.log('Artists inserted successfully');
    const createdUsers = await insertUsers();
    console.log(
      '------------------------  Users inserted successfully  ------------------------'
    );

    console.log(
      '------------------------  Inserting custom data with song files, this may take while  -------------------------'
    );
    for (let data of customData) {
      const fakeImageID = await uploadImage(
        data.artist.profile_image_url,
        data.artist.first_name
      );

      const shuffledFollower = shuffleArray(createdUsers);
      const selectedUFollowers = shuffledFollower.slice(0, numUsersToSelect);
      let cArtist = await Artist.create({
        ...data.artist,
        profile_image_url: new mongoose.Types.ObjectId(fakeImageID),
        'following.users': selectedUFollowers,
        'followers.users': selectedUFollowers,
      });
      await SongFile.create({
        filename: data.artist.first_name,
        mimetype: 'image/jpeg',
        uploadDate: new Date(),
        fileId: fakeImageID,
      });

      for (let i = 0; i <= numberOfSongsWithoutAlbums; i++) {
        const fsname = generateName();
        const fakefsImageID = await uploadImage(
          faker.image.urlLoremFlickr({
            width: 250,
            height: 250,
            category: 'abstract',
          }),
          'sample_song'
        );
        const songwa = {
          album: null,
          artists: [cArtist._id],
          title: faker.word.sample(5),
          writtenBy: fsname.first_name,
          producers: [fsname.last_name],
          language: faker.helpers.arrayElement(languages),
          genre: faker.helpers.arrayElement(MusicGenres),
          release_date: faker.date.past(),
          cover_image_url: fakefsImageID,
          song_url: faker.helpers.arrayElement(songIdArray),
        };
        await SongFile.create({
          filename: 'sample_song',
          mimetype: 'image/jpeg',
          uploadDate: new Date(),
          fileId: fakefsImageID,
        });
        Song.create(songwa);
      }

      for (let album of data.albums) {
        const fakeAlbumImageID = await uploadImage(
          album.album.cover_image_url,
          album.album.title
        );

        //populating liked_by for albums
        const shuffledUsers = shuffleArray(createdUsers);
        const selectedUsers = shuffledUsers.slice(0, numUsersToSelect);
        const liked_by = {
          users: selectedUsers.map((user) => user._id),
          artists: [cArtist._id],
        };

        let cAlbum = await Album.create({
          ...album.album,
          cover_image_url: new mongoose.Types.ObjectId(fakeAlbumImageID),
          liked_by,
        });
        cAlbum.artists = [{ artistId: cArtist._id }];

        await SongFile.create({
          filename: album.album.title,
          mimetype: 'image/jpeg',
          uploadDate: new Date(),
          fileId: fakeAlbumImageID,
        });

        for (let song of album.songs) {
          const fakeSongImageID = await uploadImage(
            song.cover_image_url,
            song.title
          );

          await SongFile.create({
            filename: song.title,
            mimetype: 'image/jpeg',
            uploadDate: new Date(),
            fileId: fakeSongImageID,
          });
          song.artists = [cArtist._id];
          song.album = cAlbum._id;
          song.song_url = faker.helpers.arrayElement(songIdArray);
          song.cover_image_url = new mongoose.Types.ObjectId(fakeSongImageID);
          song.likes = numUsersToSelect;
          let cSong = await Song.create(song);
          cAlbum.songs.push({ songId: cSong._id });
          await cAlbum.save();
        }
      }
      console.log(
        `+++++++++++++++++++++++++++++++++++++++++++ Processed ${count}/${artistsToBeSeeded} artists`
      );
      count++;
    }

    for (const user of createdUsers) {
      await generatePlaylist(user._id);
    }
    console.log('Playlists populated successfully');

    await populateListeningHistory();

    await populateUserDatawithRemainingFields();

    console.log(
      '------------------------  Database seeded successfully  -------------------------'
    );
    // mongoose.disconnect();
    // console.log('Database connection closed');
  } catch (err) {
    console.error('Error seeding database:', err);
    mongoose.disconnect();
  } finally {
    mongoose.disconnect();
    console.log('Database connection closed');
  }
}

seed();
