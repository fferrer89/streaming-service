import Songs from '../models/songModel.js';
import songHelper from '../utils/songsHelpers.js';
import ListenHistory from '../models/listeningHistoryModel.js';
import User from '../models/userModel.js';
import { Types } from 'mongoose';
import Artist from '../models/artistModel.js';
import Album from '../models/albumModel.js';
import GraphQLUpload from 'graphql-upload/GraphQLUpload.mjs';
import { GridFSBucket } from 'mongodb';
import SongFile from '../models/songFileModel.js';
import mongoose from 'mongoose';
export const songResolvers = {
  Query: {
    songs: async (_, args, context) => {
      let songs = await Songs.find({});
      if (songs.length == 0) {
        songHelper.notFoundWrapper('Songs Not found');
      }
      // no need to convert to string
      return songs;
    },
    getSongById: async (_, args, context) => {
      let { _id: id } = args;
      try {
        id = id.trim();
        songHelper.validObjectId(id);
        let song = await Songs.findById(id);
        if (!song) {
          throw 'Song Not found';
        }

        return song;
      } catch (error) {
        songHelper.notFoundWrapper(error);
      }
    },

    getSongsByTitle: async (_, args, context) => {
      let { searchTerm: term } = args;
      term = songHelper.emptyValidation(term, 'Title');

      let songs = await Songs.find({
        title: { $regex: new RegExp(`^${term}`, 'i') },
      });
      return songs.map((song) => ({
        ...song._doc,
        song_url: song.song_url || '', // Provide an empty string if song_url is null or undefined
      }));
    },

    getSongsByAlbumID: async (_, args, context) => {
      let { albumId } = args;
      albumId = songHelper.emptyValidation(albumId, 'albumId');
      albumId = songHelper.validObjectId(albumId, 'albumId');
      let songs = await Songs.find({ album: albumId });

      if (songs.length == 0) {
        songHelper.notFoundWrapper('Songs not found by this album id');
      }

      return songs;
    },

    getSongsByArtistID: async (_, args, context) => {
      let { artistId } = args;

      artistId = songHelper.emptyValidation(artistId, 'artistId');
      artistId = songHelper.validObjectId(artistId, 'artistId');

      let songs = await Songs.find({ artists: { $eq: artistId } });

      if (songs.length == 0) {
        songHelper.notFoundWrapper('Songs not found by this Artist id');
      }
      return songs;
    },

    getSongsByWriter: async (_, args, context) => {
      let { searchTerm: term } = args;
      term = songHelper.emptyValidation(term, "Writer's name");
      if (term.length < 3) {
        songHelper.badUserInputWrapper(
          'search term should be at least 3 characters long'
        );
      }
      let songs = await Songs.find({
        writtenBy: { $regex: new RegExp(term, 'i') },
      });
      if (songs.length < 1) {
        songHelper.notFoundWrapper('Song not found');
      }

      return songs;
    },

    getSongsByGenre: async (_, args, context) => {
      let { genre } = args;
      genre = songHelper.emptyValidation(genre, 'Genre');
      genre = genre.toLowerCase();
      let songs = await Songs.find({ genre: genre });
      if (songs.length < 1) {
        songHelper.notFoundWrapper('Song not found');
      }
      return songs;
    },
    getMostLikedSongs: async (_, { limit = 10 }, context) => {
      if (limit < 1) {
        songHelper.badUserInputWrapper('limit should be grater than 0');
      }
      let songs = await Songs.aggregate([
        { $sort: { likes: -1 } },
        { $limit: limit },
      ]);
      if (songs.length < 1) {
        return [];
      }
      return songs;
    },
    getNewlyReleasedSongs: async (_, { limit = 10 }, context) => {
      if (limit < 1) {
        songHelper.badUserInputWrapper('limit should be grater than 0');
      }
      let songs = await Songs.aggregate([
        { $sort: { release_date: -1 } },
        { $limit: limit },
      ]);
      if (songs.length < 1) {
        return [];
      }
      return songs;
    },
    getTrendingSongs: async (_, { limit = 10 }, context) => {
      //Not complete;
      if (limit < 1) {
        songHelper.badUserInputWrapper('limit should be grater than 0');
      }
      const yesterdayDate = new Date();
      yesterdayDate.setDate(yesterdayDate.getDate() - 1); //last 24 hours

      const group = { $group: { _id: '$songId', countSong: { $sum: 1 } } };
      const match = { $match: { timestamp: { $gte: yesterdayDate } } };
      const sort = { $sort: { $countSong: 1 } };
      const limitkey = { $limit: limit };
      const sortByCount = { $sortByCount: '$songId' };

      let songsIds = await ListenHistory.aggregate([
        match,
        sortByCount,
        limitkey,
      ]);
      //YET TO BE TESTED;
    },

    getUserLikedSongs: async (_, args, context) => {
      let { userId } = args;
      userId = songHelper.emptyValidation(userId, 'user id');
      songHelper.validObjectId(userId, 'userId');
      let likedSongsId = await User.findById({
        _id: new Types.ObjectId(userId),
      }).select('liked_songs');

      if (!likedSongsId) {
        songHelper.notFoundWrapper('Not Found');
      }

      likedSongsId = likedSongsId.liked_songs.map((song) => {
        return song.songId;
      });

      let songs = await Songs.find({ _id: { $in: likedSongsId } });
      return songs;
    },

    getMostLikedSongsOfArtist: async (_, args, context) => {
      let { artistId, limit } = args;
      if (limit < 1) {
        songHelper.badUserInputWrapper('limit should be grater than 0');
      }
      artistId = songHelper.emptyValidation(artistId, 'artistId');
      songHelper.validObjectId(artistId, 'artistId');
      let songs = await Songs.aggregate([
        { $match: { artists: { $eq: new Types.ObjectId(artistId) } } },
        { $sort: { likes: -1 } },
        { $limit: limit || 10 },
      ]);

      return songs;
    },
    streamSong: async (_, { songID }, { db }) => {
      // this does not work, we are using express to steram song file
      try {
        var objectId = new Types.ObjectId(songID);
      } catch (err) {
        throw new Error('Invalid songID. Must be a valid MongoDB ObjectID.');
      }

      let bucket = new GridFSBucket(mongoose.connection.db);

      let downloadStream = bucket.openDownloadStream(objectId);

      return downloadStream;
    },
  },

  Song: {
    album: async (parent) => {
      let { album: albumId } = parent;
      if (albumId) {
        songHelper.validObjectId(albumId);
        let album = await Album.findById(albumId);
        if (!album) {
          songHelper.notFoundWrapper(`Album not found ${albumId}`);
        }
        album._id = album._id.toString();
        album.artists =
          album.artists.length > 0
            ? album.artists.map((artist) => artist._id.toString())
            : [];

        album.songs =
          album.songs.length > 0
            ? album.songs.map((song) => song.songId.toString())
            : [];
        return album;
      }
    },

    artists: async (parent) => {
      let artistIds = parent.artists.map((id) => new Types.ObjectId(id));
      let artists = await Artist.find({ _id: { $in: artistIds } });
      if (!artists) {
        songHelper.notFoundWrapper('Artist(s) not found');
      }

      const converToString = (arr) => {
        return arr.map((val) => val.toString());
      };

      //converting ObjectId to string;
      return artists;
      // .map((artist) => {
      //   artist._id = artist._id.toString();
      //   artist.following.users = converToString(artist.following.users);
      //   artist.following.artists = converToString(artist.following.artists);
      //   artist.followers.users = converToString(artist.followers.users);
      //   artist.followers.artists = converToString(artist.followers.artists);
      //   return artist;
      // });
    },
  },
  Upload: GraphQLUpload,
  Mutation: {
    addSong: async (_, args, context) => {
      let {
        artists,
        album,
        title,
        lyrics,
        duration,
        song_url,
        cover_image_url,
        writtenBy,
        producers,
        genre,
        release_date,
      } = args;
      let queryObject = {
        artists,
        title,
        duration,
        song_url,
        cover_image_url,
        writtenBy,
        producers,
        genre,
        release_date,
      };

      //TODO: Check if the user is artist or not.
      console.log(args);
      if (album) {
        songHelper.emptyValidation(album, "album can't be empty spaces");
        songHelper.validObjectId(album);
        let albumExist = await Album.findById(album);
        if (!albumExist) {
          songHelper.badUserInputWrapper(`Album not found, ${album}`);
        }

        // check if artist provided here match the artits in album.
        let albumArtistSet = new Set(
          albumExist.artists.map((art) => art._id.toString())
        );

        if (albumArtistSet.size != artists.length) {
          songHelper.badUserInputWrapper('Artist do not match with album');
        }
        for (let i = 0; i < artists.length; i++) {
          if (!albumArtistSet.has(artists[i])) {
            songHelper.badUserInputWrapper('Artist do not match with album');
          }
        }
        queryObject.album = album;
      }

      if (lyrics) {
        queryObject.lyrics = lyrics;
      }
      queryObject.release_date = songHelper.validDate(
        queryObject.release_date,
        'Release date'
      );

      //Check if artists exist:
      for (let i = 0; i < artists.length; i++) {
        songHelper.validObjectId(artists[i]);
        let artistExist = await Artist.findById(artists[i]);
        if (!artistExist) {
          songHelper.badUserInputWrapper('Artist does not exist');
        } else if (
          !context ||
          !context.decoded ||
          artistExist._id.toString != context.decoded.id
        ) {
          //songHelper.unAuthorizedWrapper();
        }
      }

      songHelper.validObjectId(queryObject.song_url.trim());
      const song = await SongFile.findOne({
        fileId: queryObject.song_url.trim(),
      });
      if (!song) {
        songHelper.notFoundWrapper('Song file not found with given url');
      }

      songHelper.validObjectId(queryObject.cover_image_url.trim());
      const cover = await SongFile.findOne({
        fileId: queryObject.cover_image_url.trim(),
      });
      if (!cover) {
        songHelper.notFoundWrapper('Cover Image file not found with given url');
      }

      try {
        let newSong = new Songs(queryObject);
        const savedSong = await newSong.save();

        //if album id is present then add the song id to ablum collection.
        if (album) {
          let albumUpdate = await Album.findByIdAndUpdate(album, {
            $push: { songs: newSong._id },
          });
        }
        return savedSong;
      } catch (error) {
        songHelper.badUserInputWrapper(error.message);
      }
    },
    editSong: async (_, args, context) => {
      let queryObject = {};
      songHelper.validObjectId(args.songId);
      let songExist = await Songs.findById(args.songId);
      if (!songExist) {
        songHelper.notFoundWrapper('Song not found');
      } else {
        //Are the valid user to edit the song?
        let validUser = false;
        for (let i = 0; i < songExist.artists.length; i++) {
          if (
            context &&
            context.decoded &&
            context.decoded.id == songExist.artists[i].toString()
          ) {
            console.log(context.decoded.id, songExist.artists[i].toString());
            validUser = true;
          }
        }
        if (context && context.decoded && context.decoded.role === 'admin') {
          validUser = true;
        }
        validUser = true;
        if (!validUser) {
          songHelper.unAuthorizedWrapper();
        }
      }

      if (args.duration) {
        if (duration <= 0)
          songHelper.badUserInputWrapper(
            "Duration can't less than or equal to 0"
          );
        queryObject.duration = args.duration;
      }

      if (args.song_url) {
        //queryObject.song_url = songHelper.validURL(args.song_url);
        songHelper.validObjectId(args.song_url.trim());
        const song = await SongFile.findOne({
          fileId: args.song_url.trim(),
        });
        if (!song) {
          songHelper.notFoundWrapper('Song file not found with given url');
        }
      }

      if (args.cover_image_url) {
        //queryObject.cover_image_url = songHelper.validURL(args.cover_image_url);
        songHelper.validObjectId(args.cover_image_url.trim());
        const cover = await SongFile.findOne({
          fileId: args.cover_image_url.trim(),
        });
        if (!cover) {
          songHelper.notFoundWrapper(
            'Cover Image file not found with given url'
          );
        }
      }

      if (args.writtenBy) {
        queryObject.writtenBy = songHelper.emptyValidation(
          args.writtenBy,
          "Writer' name"
        );
        const alphaRegex = /^[a-zA-Z\s]+$/;
        if (!alphaRegex.test(queryObject.writtenBy))
          songHelper.badUserInputWrapper("Writer's name can only have letters");
      }
      if (args.genre) {
        queryObject.genre = songHelper.validGenre(args.genre);
      }
      if (args.release_date) {
        queryObject.release_date = songHelper.validDate(
          args.release_date,
          'Release date'
        );
      }

      if (args.title) {
        queryObject.title = songHelper.emptyValidation(args.title, 'Title');
        const alphaNumericRegex = /^[a-zA-Z0-9\s]+$/;
        if (!alphaNumericRegex.test(queryObject.title))
          songHelper.badUserInputWrapper(
            'Title name can only have letters and digits'
          );
      }

      if (args.artists && args.artists.length > 0) {
        //check if artist exists;
        for (let i = 0; i < args.artists.length; i++) {
          let id = songHelper.emptyValidation(args.artists[i], 'Artist id');
          songHelper.validObjectId(id);
          let artistExist = await Artist.findById(id);
          if (!artistExist) {
            songHelper.badUserInputWrapper(
              'Artist Id is incorrect, Artist not found.'
            );
          }
        }
        queryObject.artists = args.artists;
      }
      if (args.producers && args.producers.length > 0) {
        queryObject.producers = args.producers;
      }
      let { songId } = args;
      try {
        songHelper.validObjectId(songId);
        let songEdited = await Songs.findByIdAndUpdate(
          args.songId,
          { $set: queryObject },
          { new: true }
        );
        return songEdited;
      } catch (error) {
        songHelper.badUserInputWrapper(error.message);
      }
    },
    removeSong: async (_, args, context) => {
      //Song id
      let { songId } = args;
      songId = songHelper.emptyValidation(songId, 'song id');
      let songExist;
      try {
        songExist = await Songs.findById(songId);
        if (!songExist) {
          songHelper.notFoundWrapper('Song not found');
        }
      } catch (error) {
        songHelper.notFoundWrapper(error); //Incase findById throws array for invalid objectId.
      }
      //Check if user requesting delete is one of the artist;
      let validUser = false;
      for (let i = 0; i < songExist.artists.length; i++) {
        if (context.decoded.id == songExist.artists[i].toString()) {
          console.log(context.decoded.id, songExist.artists[i].toString());
          validUser = true;
        }
      }
      if (!validUser) {
        songHelper.unAuthorizedWrapper();
      }

      //Remove song from song Collection.
      try {
        let songDel = await Songs.deleteOne({
          _id: new Types.ObjectId(songId),
        });
      } catch (error) {
        songHelper.serverSideErrorWrapper(
          'Something went wrong, could not delete song'
        );
      }

      //Remoce song from Album Colleciton.
      try {
        let songDel = await Album.findByIdAndUpdate(songExist.album, {
          $pull: { songs: songExist._id },
        });
      } catch (error) {
        songHelper.serverSideErrorWrapper(
          'Something went wrong, could not delete song from album'
        );
      }

      //Remove song from User collection.
      try {
        let songDel = await User.updateMany(
          { liked_songs: { $eq: songExist._id } },
          { $pull: { liked_songs: songExist._id } }
        );
      } catch (error) {
        console.log(error);
      }

      //Set Deleted field to true in listening history Collection.
      try {
        let sonfDel = await ListenHistory.updateMany(
          { songId: songExist._id },
          { deleted: true }
        );
      } catch (error) {
        console.log(error);
      }

      return songExist;
    },
    toggleLikeSong: async (args) => {},
    uploadSongFile: async (_, args) => {
      try {
        const { filename, mimetype, encoding, createReadStream } =
          await args.file;

        const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db);

        const uploadStream = bucket.openUploadStream(filename, {
          contentType: mimetype,
          metadata: { originalName: filename },
        });
        createReadStream().pipe(uploadStream);

        uploadStream.on('finish', async () => {
          const file = new SongFile({
            filename,
            mimetype,
            fileId: uploadStream.id,
          });
          await file.save();
        });
        return uploadStream.id;
      } catch (error) {
        throw new Error('Failed to upload file');
      }
    },
  },
};
