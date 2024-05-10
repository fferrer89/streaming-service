import { GraphQLError } from 'graphql';
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
import Playlist from '../models/playlistModel.js';

export const songResolvers = {
  Query: {
    songs: async (_, args, context) => {
      try {
        const cachedSongs = await context.redisClient.json.get('song_songs');
        if (cachedSongs) {
          return cachedSongs;
        }

        const allSongs = await Songs.find();
        if (allSongs && allSongs.length !== 0) {
          await context.redisClient.json.set('song_songs', '$', allSongs);
          await context.redisClient.EXPIRE('song_songs', 300);

          return allSongs;
        } else {
          return [];
        }
      } catch (error) {
        throw new GraphQLError(`Failed to fetch songs: ${error.message}`);
      }
    },
    getSongById: async (_, args, context) => {
      let { _id: id } = args;
      try {
        id = id.trim();
        songHelper.validObjectId(id);

        const cacheKey = `song_song:${id}`;
        let song = await context.redisClient.json.get(cacheKey);
        if (song) {
          return song;
        }

        song = await Songs.findById(id);
        if (!song) {
          throw new GraphQLError('Song Not found');
        }

        await context.redisClient.json.set(cacheKey, '$', song);
        await context.redisClient.EXPIRE(cacheKey, 300);

        return song;
      } catch (error) {
        songHelper.notFoundWrapper(error);
      }
    },

    getSongsByTitle: async (_, { searchTerm: term, limit = 10 }, context) => {
      term = songHelper.emptyValidation(term, 'Title');

      const cacheKey = `song_songsByTitle:${term}:${limit}`;
      let cachedSongs = await context.redisClient.json.get(cacheKey);
      if (cachedSongs) {
        return cachedSongs;
      }

      let songs = await Songs.find({
        title: { $regex: new RegExp(`^${term}`, 'i') },
      }).limit(limit);

      if (songs.length > 0) {
        await context.redisClient.json.set(cacheKey, '$', songs);
        await context.redisClient.EXPIRE(cacheKey, 300);
      }

      return songs.map((song) => ({
        ...song._doc,
        song_url: song.song_url || '',
      }));
    },

    getSongsByAlbumID: async (_, args, context) => {
      let { albumId } = args;
      albumId = songHelper.emptyValidation(albumId, 'albumId');
      albumId = songHelper.validObjectId(albumId, 'albumId');

      const cacheKey = `song_songsByAlbum:${albumId}`;
      let cachedSongs = await context.redisClient.json.get(cacheKey);
      if (cachedSongs) {
        return cachedSongs;
      }

      let songs = await Songs.find({ album: albumId });
      if (songs.length == 0) {
        songHelper.notFoundWrapper('Songs not found by this album id');
      } else {
        await context.redisClient.json.set(cacheKey, '$', songs);
        await context.redisClient.EXPIRE(cacheKey, 300);
      }

      return songs;
    },

    getSongsByArtistID: async (_, args, context) => {
      let { artistId } = args;

      artistId = songHelper.emptyValidation(artistId, 'artistId');
      artistId = songHelper.validObjectId(artistId, 'artistId');

      // const cacheKey = `song_songsByArtist:${artistId}`;
      // let cachedSongs = await context.redisClient.json.get(cacheKey);
      // if (cachedSongs) {
      //   return cachedSongs;
      // }

      let songs = await Songs.find({ artists: { $eq: artistId } });
      if (songs.length == 0) {
        return [];
      } else {
        // await context.redisClient.json.set(cacheKey, '$', songs);
        // await context.redisClient.EXPIRE(cacheKey, 300);
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

      // const cacheKey = `song_songsByWriter:${term}`;
      // let cachedSongs = await context.redisClient.json.get(cacheKey);
      // if (cachedSongs) {
      //   return cachedSongs;
      // }

      let songs = await Songs.find({
        writtenBy: { $regex: new RegExp(term, 'i') },
      });
      if (songs.length < 1) {
        songHelper.notFoundWrapper('Song not found');
      } else {
        // await context.redisClient.json.set(cacheKey, '$', songs);
        // await context.redisClient.EXPIRE(cacheKey, 300);
      }

      return songs;
    },

    getSongsByGenre: async (_, args, context) => {
      let { genre } = args;
      genre = songHelper.emptyValidation(genre, 'Genre');
      genre = genre.toLowerCase();

      const cacheKey = `song_songsByGenre:${genre}`;
      let cachedSongs = await context.redisClient.json.get(cacheKey);
      if (cachedSongs) {
        return cachedSongs;
      }

      let songs = await Songs.find({ genre: genre });
      if (songs.length < 1) {
        songHelper.notFoundWrapper('Song not found');
      } else {
        await context.redisClient.json.set(cacheKey, '$', songs);
        await context.redisClient.EXPIRE(cacheKey, 300);
      }
      return songs;
    },
    getMostLikedSongs: async (_, { limit = 10 }, context) => {
      if (limit < 1) {
        songHelper.badUserInputWrapper('limit should be greater than 0');
      }

      const cacheKey = `song_mostLikedSongs:${limit}`;
      let cachedSongs = await context.redisClient.json.get(cacheKey);
      if (cachedSongs) {
        return cachedSongs;
      }

      let songs = await Songs.aggregate([
        { $sort: { likes: -1 } },
        { $limit: limit },
      ]);
      if (songs.length < 1) {
        return [];
      } else {
        await context.redisClient.json.set(cacheKey, '$', songs);
        await context.redisClient.EXPIRE(cacheKey, 300);
      }
      return songs;
    },
    getNewlyReleasedSongs: async (_, { limit = 10 }, context) => {
      if (limit < 1) {
        songHelper.badUserInputWrapper('limit should be greater than 0');
      }

      const cacheKey = `song_newlyReleasedSongs:${limit}`;
      let cachedSongs = await context.redisClient.json.get(cacheKey);
      if (cachedSongs) {
        return cachedSongs;
      }

      let songs = await Songs.aggregate([
        { $sort: { release_date: -1 } },
        { $limit: limit },
      ]);
      if (songs.length < 1) {
        return [];
      } else {
        await context.redisClient.json.set(cacheKey, '$', songs);
        await context.redisClient.EXPIRE(cacheKey, 300);
      }
      return songs;
    },
    getTrendingSongs: async (_, { limit = 10 }, context) => {
      if (limit < 1) {
        songHelper.badUserInputWrapper('limit should be greater than 0');
      }

      const cacheKey = `song_trendingSongs:${limit}`;
      let cachedSongs = await context.redisClient.json.get(cacheKey);
      if (cachedSongs) {
        return cachedSongs;
      }

      const yesterdayDate = new Date();
      yesterdayDate.setDate(yesterdayDate.getDate() - 1); //last 24 hours

      const match = { $match: { timestamp: { $gte: yesterdayDate } } };
      const sortByCount = { $sortByCount: '$songId' };
      const limitKey = { $limit: limit };

      let songsIds = await ListenHistory.aggregate([
        match,
        sortByCount,
        limitKey,
      ]);

      if (songsIds.length < 1) {
        return [];
      } else {
        let songIdsArray = songsIds.map((song) => song._id);
        let songs = await Songs.find({ _id: { $in: songIdsArray } });
        await context.redisClient.json.set(cacheKey, '$', songs);
        await context.redisClient.EXPIRE(cacheKey, 300);
        return songs;
      }
    },
    getUserLikedSongs: async (_, args, context) => {
      let { userId } = args;
      userId = songHelper.emptyValidation(userId, 'user id');
      songHelper.validObjectId(userId, 'userId');

      const cacheKey = `song_userLikedSongs:${userId}`;
      let cachedSongs = await context.redisClient.json.get(cacheKey);
      if (cachedSongs) {
        return cachedSongs;
      }

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
      if (songs.length < 1) {
        return [];
      } else {
        await context.redisClient.json.set(cacheKey, '$', songs);
        await context.redisClient.EXPIRE(cacheKey, 300);
        return songs;
      }
    },

    getMostLikedSongsOfArtist: async (_, args, context) => {
      let { artistId, limit } = args;
      if (limit < 1) {
        songHelper.badUserInputWrapper('limit should be greater than 0');
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
    getNextSongs: async (_, { clickedSongId }, context) => {
      try {
        const clickedSong = await Songs.findById(clickedSongId);
        if (!clickedSong) {
          throw new Error('Clicked song not found');
        }

        const newlyReleasedAlbums = await Album.find({
          release_date: { $gte: new Date() },
          genres: clickedSong.genre,
        }).limit(5);
        const albumIds = newlyReleasedAlbums.map((album) => album._id);
        const songsFromNewlyReleasedAlbums = await Songs.find({
          album: { $in: albumIds },
        }).limit(10);

        const mostLikedPlaylists = await Playlist.find({
          genres: clickedSong.genre,
        })
          .sort({ likes: -1 })
          .limit(5);
        const playlistSongIds = mostLikedPlaylists.flatMap(
          (playlist) => playlist.songs
        );
        const songsFromMostLikedPlaylists = await Songs.find({
          _id: { $in: playlistSongIds },
        }).limit(10);

        const mostLikedArtists = await Artist.find({
          genres: clickedSong.genre,
        })
          .sort({ likes: -1 })
          .limit(5);
        const artistSongIds = mostLikedArtists.flatMap(
          (artist) => artist.songs
        );
        const songsFromMostLikedArtists = await Songs.find({
          _id: { $in: artistSongIds },
        }).limit(10);

        let nextSongs = [
          ...songsFromNewlyReleasedAlbums,
          ...songsFromMostLikedPlaylists,
          ...songsFromMostLikedArtists,
        ];

        let uniqueSongs = Array.from(
          new Set(nextSongs.map((song) => song._id))
        ).map((id) => {
          return nextSongs.find((song) => song._id === id);
        });

        if (uniqueSongs.length < 30) {
          const additionalSongs = await Songs.aggregate([
            { $match: { genre: clickedSong.genre } },
            { $sort: { release_date: -1 } },
            { $limit: 30 - uniqueSongs.length },
          ]);
          uniqueSongs = [...uniqueSongs, ...additionalSongs];
        }

        if (uniqueSongs.length < 30) {
          const additionalSongs = await Songs.aggregate([
            { $sample: { size: 30 - uniqueSongs.length } },
          ]);
          uniqueSongs = [...uniqueSongs, ...additionalSongs];
        }

        return uniqueSongs.slice(0, 30);
      } catch (error) {
        throw new GraphQLError(error.message);
      }
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
      try {
        const {
          title,
          duration,
          song_url,
          cover_image_url,
          writtenBy,
          producers,
          genre,
          release_date,
          artists,
          lyrics,
          album,
        } = args;

        const existingArtists = await Artist.find({ _id: { $in: artists } });
        if (existingArtists.length !== artists.length) {
          throw new Error('One or more artist IDs are invalid');
        }
        if (album) {
          const existingAlbum = await Album.findById(album);
          if (!existingAlbum) {
            throw new Error('Album not found with given ID');
          }
        }
        const sampleImage = await SongFile.findOne({
          filename: 'sample_song_image',
        }).fileId;
        const song = new Songs({
          title,
          duration,
          song_url,
          cover_image_url: cover_image_url || sampleImage,
          writtenBy,
          producers,
          genre,
          release_date,
          artists,
          lyrics,
          album,
        });

        const newSong = await song.save();

        const relatedCacheKeys = [
          `song_songs`,
          `song_song:${newSong._id}`,
          `song_songsByAlbum:${album}`,
          `song_songsByArtist:${artists.join(':')}`,
          `song_songsByWriter:${writtenBy}`,
          `song_songsByGenre:${genre}`,
          `song_mostLikedSongs`,
          `song_newlyReleasedSongs`,
          `song_trendingSongs`,
          ...artists.map((artistId) => `song_artist:${artistId}`),
          album ? `song_album:${album}` : null,
        ].filter((key) => key !== null);

        relatedCacheKeys.forEach(async (key) => {
          await context.redisClient.DEL(key);
        });

        const keysToDelete = await context.redisClient.keys(
          'song_songsByTitle:*'
        );
        keysToDelete.forEach(async (key) => {
          await context.redisClient.DEL(key);
        });

        return newSong;
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    },
    editSong: async (_, args, context) => {
      try {
        const {
          songId,
          title,
          duration,
          song_url,
          cover_image_url,
          writtenBy,
          producers,
          genre,
          release_date,
          artists,
        } = args;

        const existingSong = await Songs.findById(songId);
        if (!existingSong) {
          throw new Error('Song not found');
        }

        if (title) existingSong.title = title;
        if (duration) existingSong.duration = duration;
        if (song_url) existingSong.song_url = song_url;
        if (cover_image_url) existingSong.cover_image_url = cover_image_url;
        if (writtenBy) existingSong.writtenBy = writtenBy;
        if (producers) existingSong.producers = producers;
        if (genre) existingSong.genre = genre;
        if (release_date) existingSong.release_date = release_date;
        if (artists) existingSong.artists = artists;

        const updatedSong = await existingSong.save();
        const relatedCacheKeys = [
          `song_songs`,
          `song_song:${songId}`,
          `song_songsByAlbum:${existingSong.album}`,
          `song_songsByWriter:${writtenBy}`,
          `song_songsByGenre:${genre}`,
          `song_mostLikedSongs`,
          `song_newlyReleasedSongs`,
          `song_trendingSongs`,
          existingSong.album ? `song_album:${existingSong.album}` : null,
        ].filter((key) => key !== null);

        const keysToDelete = await context.redisClient.keys(
          'song_songsByTitle:*'
        );
        const keysToDelete2 = await context.redisClient.keys(
          'song_songsByArtist:*'
        );

       
        const allKeysToDelete = relatedCacheKeys.concat(
          keysToDelete,
          keysToDelete2
        );

       
        await Promise.all(
          allKeysToDelete.map((key) => context.redisClient.DEL(key))
        );

        return updatedSong;
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    },
    removeSong: async (_, args, context) => {
      try {
        let songId = songHelper.emptyValidation(args.songId, 'songId');
        songId = songHelper.validObjectId(args.songId, 'songId');
        songId = new Types.ObjectId(songId);
        const existingSong = await Songs.findById(songId);
        if (!existingSong) {
          songHelper.notFoundWrapper('Song Not Found');
        }

        await Album.updateMany(
          { 'songs.songId': songId },
          { $pull: { songs: { songId } } }
        );

        await ListenHistory.deleteMany({ songId });

        await Playlist.updateMany(
          { songs: songId },
          { $pull: { songs: songId } }
        );

        await User.updateMany(
          { liked_songs: songId },
          { $pull: { liked_songs: songId } }
        );

        const removedSong = await Songs.findByIdAndDelete(songId);

        const relatedCacheKeys = [
          `song_songs`,
          `song_song:${songId}`,
          `song_songsByAlbum:${existingSong.album}`,
          `song_songsByArtist:${existingSong.artists.join(':')}`,
          `song_songsByWriter:${existingSong.writtenBy}`,
          `song_songsByGenre:${existingSong.genre}`,
          `song_mostLikedSongs`,
          `song_newlyReleasedSongs`,
          `song_trendingSongs`,
          ...existingSong.artists.map((artistId) => `song_artist:${artistId}`),
          existingSong.album ? `song_album:${existingSong.album}` : null,
        ].filter((key) => key !== null);

        relatedCacheKeys.forEach(async (key) => {
          await context.redisClient.DEL(key);
        });

        const keysToDelete = await context.redisClient.keys(
          'song_songsByTitle:*'
        );
        keysToDelete.forEach(async (key) => {
          await context.redisClient.DEL(key);
        });

        return removedSong;
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    },
    toggleLikeSong: async (_, { _id, songId }, context) => {
      try {
        const user = await User.findById(_id);
        if (!user) {
          throw new Error('User not found');
        }

        const song = await Songs.findById(songId);
        if (!song) {
          throw new Error('Song not found');
        }

        const likedIndex = user.liked_songs.findIndex(
          (likedSong) => likedSong.songId.toString() === songId
        );

        let userLikedSongsCacheUpdated = false;

        if (likedIndex === -1) {
          // Like the song
          user.liked_songs.push({ songId, liked_date: new Date().toISOString() });
          song.likes = (song.likes || 0) + 1;
          userLikedSongsCacheUpdated = true;
        } else {
          // Unlike the song
          user.liked_songs.splice(likedIndex, 1);
          song.likes = (song.likes || 0) - 1;
        }

        await user.save();
        const updatedSong = await song.save();

        const songCacheKey = `song_song:${songId}`;
        await context.redisClient.json.set(songCacheKey, '$', updatedSong);
        await context.redisClient.EXPIRE(songCacheKey, 300);

        const relatedCacheKeys = [
          `song_songs`,
          `song_song:${songId}`,
          `song_songsByAlbum:${song.album}`,
          `song_songsByArtist:${song.artists.join(':')}`,
          `song_songsByWriter:${song.writtenBy}`,
          `song_songsByGenre:${song.genre}`,
          `song_mostLikedSongs`,
          `song_newlyReleasedSongs`,
          `song_trendingSongs`,
          ...song.artists.map((artistId) => `song_artist:${artistId}`),
          song.album ? `song_album:${song.album}` : null,
        ].filter((key) => key !== null);

        relatedCacheKeys.forEach(async (key) => {
          await context.redisClient.DEL(key);
        });

        const keysToDelete = await context.redisClient.keys(
          'song_songsByTitle:*'
        );
        keysToDelete.forEach(async (key) => {
          await context.redisClient.DEL(key);
        });

        
        if (userLikedSongsCacheUpdated) {
          const userLikedSongsCacheKey = `song_userLikedSongs:${_id}`;
          await context.redisClient.DEL(userLikedSongsCacheKey);
        }

        return updatedSong;
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    },
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
