import { GraphQLError } from 'graphql';
import Album from '../models/albumModel.js';
import mongoose from 'mongoose';
import Song from '../models/songModel.js';
import Artist from '../models/artistModel.js';
import songsHelpers from '../utils/songsHelpers.js';
import { validateMogoObjID } from '../utils/helpers.js';
import songHelper from '../utils/songsHelpers.js';

export const albumResolvers = {
  Album: {
    artists: async (parent, _, context) => {
      const artistIds = parent.artists;
      const ids = artistIds.map((artist) => artist.artistId);
      const artists = await Artist.find({ _id: { $in: ids } });
      return artists;
    },
    songs: async (parent, _, context) => {
      const songIds = parent.songs;
      const ids = songIds.map((song) => song.songId);
      const songs = await Song.find({ _id: { $in: ids } });
      return songs;
    }
  },
  Query: {
    albums: async (_, args, context) => {
      try {
        const cachedAlbums = await context.redisClient.json.get('albums');
        if (cachedAlbums) {
          return cachedAlbums;
        }

        const allAlbums = await Album.find();
        if (allAlbums && allAlbums.length !== 0) {
          await context.redisClient.json.set('albums', '$', allAlbums);
          await context.redisClient.EXPIRE('albums', 1800);

          return allAlbums;
        } else {
          return [];
        }
      } catch (error) {
        throw new GraphQLError(`Failed to fetch albums: ${error.message}`);
      }
    },
    getAlbumById: async (_, { _id }, context) => {
      try {
        validateMogoObjID(_id.trim(), 'album id');
        const cachedAlbum = await context.redisClient.json.get(`album:${_id}`);
        if (cachedAlbum) {
          return cachedAlbum;
        }

        const album = await Album.findById(_id.trim());
        if (!album) {
          songHelper.notFoundWrapper('Album not found');
        }

        await context.redisClient.json.set(`album:${_id}`, '$', album);
        await context.redisClient.EXPIRE(`album:${_id}`, 1800);

        return album;
      } catch (error) {
        throw new GraphQLError(`Failed to fetch album: ${error.message}`);
      }
    },
    getAlbumsByTitle: async (_, { title }, contextValue) => {
      try {
        if (!title || typeof title !== 'string' || title.trim().length < 3) {
          songsHelpers.badUserInputWrapper(
            'Please provide at least 3 characters for album title input'
          );
        }
        const albums = await Album.find({
          title: { $regex: new RegExp(title.trim(), 'i') },
        });
        return albums;
      } catch (error) {
        throw new GraphQLError(`Failed to fetch albums: ${error.message}`);
      }
    },
    getAlbumsByVisibility: async (_, { visibility }, contextValue) => {
      try {
        const albums = await Album.find({ visibility: visibility });
        return albums;
      } catch (error) {
        throw new GraphQLError(`Failed to fetch albums: ${error.message}`);
      }
    },
    getAlbumsByGenre: async (_, { genre }, contextValue) => {
      try {
        const albums = await Album.find({ genres: { $in: [genre] } });
        return albums;
      } catch (error) {
        throw new GraphQLError(`Failed to fetch albums: ${error.message}`);
      }
    },
    getUserLikedAlbums: async (_, { userId }, contextValue) => {
      try {
        validateMogoObjID(userId.trim(), 'userId');
        const albums = await Album.find({
          'liked_by.users': { $in: [userId.trim()] },
        });
        return albums;
      } catch (error) {
        throw new GraphQLError(`Failed to fetch albums: ${error.message}`);
      }
    },
    getArtistLikedAlbums: async (_, { artistId }, contextValue) => {
      try {
        validateMogoObjID(artistId.trim(), 'artistId');
        const albums = await Album.find({
          'liked_by.artists': { $in: [artistId.trim()] },
        });
        return albums;
      } catch (error) {
        throw new GraphQLError(`Failed to fetch albums: ${error.message}`);
      }
    },
    getAlbumsByReleasedYear: async (_, { year }, contextValue) => {
      try {
        const albums = await Album.find({
          release_date: {
            $gte: new Date(Date.UTC(year, 0, 1)), // Start of the year
            $lt: new Date(Date.UTC(year + 1, 0, 1)), // End of the year
          },
        });
        return albums;
      } catch (error) {
        throw new GraphQLError(`Failed to fetch albums: ${error.message}`);
      }
    },
    getNewlyReleasedAlbums: async () => {
      try {
        const albums = await Album.find().sort({ release_date: -1 }); // Sort by release date, newest first
        return albums;
      } catch (error) {
        throw new GraphQLError(`Failed to fetch albums: ${error.message}`);
      }
    },
    getMostLikedAlbums: async (_, { limit = 10 }, contextValue) => {
      try {
        const mostLikedAlbums = await Album.find()
          .sort({ likes: -1 }) // Sort by 'likes' in descending order
          .limit(limit); // Or whatever limit you want for "most liked"

        return mostLikedAlbums;
      } catch (error) {
        throw new GraphQLError(`Failed to fetch albums: ${error.message}`);
      }
    },
    getAlbumsByArtist: async (_, { artistId }, contextValue) => {
      try {
        validateMogoObjID(artistId.trim(), 'artistId');
        const albumsByArtist = await Album.find({
          'artists.artistId': {
            $in: new mongoose.Types.ObjectId(artistId.trim()),
          }, // change this part
        });
        return albumsByArtist;
      } catch (error) {
        throw new GraphQLError(`Failed to fetch albums: ${error.message}`);
      }
    },
  },
  Mutation: {
    addAlbum: async (_, args, contextValue) => {
      try {
        const {
          title,
          description,
          release_date,
          cover_image_url,
          genres,
          artists,
          songs,
          album_type,
          visibility,
        } = args;

        const artistIds = artists && artists.map((artistId) => ({ artistId }));

        const songIds = songs && songs.map((songId) => ({ songId }));

        const newAlbum = new Album({
          title,
          description,
          release_date,
          cover_image_url,
          genres,
          album_type,
          visibility,
          artists: artistIds,
          songs: songIds,
        });

        const savedAlbum = await newAlbum.save();

        return savedAlbum;
      } catch (error) {
        throw new GraphQLError(`Error creating album: ${error.message}`, {
          extensions: { code: 'INTERNAL_SERVER_ERROR' },
        });
      }
    },

    editAlbum: async (_, args, contextValue) => {
      try {
        const updatedAlbum = await Album.findByIdAndUpdate(
          args._id,
          args, // Spread all input arguments
          { new: true } // Return the updated document
        );
        if (!updatedAlbum) {
          throw new Error('Album not found');
        }
        return updatedAlbum;
      } catch (error) {
        throw new GraphQLError(`Error updating album: ${error.message}`);
      }
    },

    addSongToAlbum: async (_, { _id, songId }, contextValue) => {
      try {
        validateMogoObjID(_id.trim(), 'album Id');
        validateMogoObjID(songId.trim(), 'song Id');
        const album = await Album.findById({
          _id: new mongoose.Types.ObjectId(_id.trim()),
        });
        if (!album) {
          songsHelpers.notFoundWrapper('Album Not Found');
        }
        const song = await Song.findById(songId.trim());
        if (!song) {
          songsHelpers.notFoundWrapper('Song Not Found');
        }
        album.songs
          ? album.songs.push({
              songId: new mongoose.Types.ObjectId(songId.trim()),
            })
          : (album.songs = [
              { songId: new mongoose.Types.ObjectId(songId.trim()) },
            ]);
        const savedAlbum = await album.save();

        song.album = new mongoose.Types.ObjectId(songId.trim());
        await song.save();
        return savedAlbum;
      } catch (error) {
        throw new GraphQLError(
          `Error adding song to album album: ${error.message}`
        );
      }
    },
    removeSongFromAlbum: async (_, { _id, songId }, contextValue) => {
      try {
        validateMogoObjID(_id.trim(), 'album Id');
        validateMogoObjID(songId.trim(), 'song Id');
        const album = await Album.findById({
          _id: new mongoose.Types.ObjectId(_id.trim()),
        });
        if (!album) {
          songsHelpers.notFoundWrapper('Album Not Found');
        }
        const song = await Song.findById(songId.trim());
        if (!song) {
          songsHelpers.notFoundWrapper('Song Not Found');
        }
        album.songs &&
          album.songs.pop({
            songId: new mongoose.Types.ObjectId(songId.trim()),
          });
        const savedAlbum = await album.save();
        song.album = null;
        await song.save();
        return savedAlbum;
      } catch (error) {
        throw new GraphQLError(
          `Error removing song from album album: ${error.message}`
        );
      }
    },

    addArtistToAlbum: async (_, { _id, artistId }, contextValue) => {
      try {
        validateMogoObjID(_id.trim(), 'album Id');
        validateMogoObjID(artistId.trim(), 'artistId');
        const album = await Album.findById({
          _id: new mongoose.Types.ObjectId(_id.trim()),
        });
        if (!album) {
          songsHelpers.notFoundWrapper('Album Not Found');
        }
        const artist = await Artist.findById(artistId.trim());
        if (!artist) {
          songsHelpers.notFoundWrapper('Artist Not Found');
        }
        album.artists
          ? album.artists.push({
              artistId: new mongoose.Types.ObjectId(artistId.trim()),
            })
          : (album.artists = [
              { artistId: new mongoose.Types.ObjectId(artistId.trim()) },
            ]);
        const savedAlbum = await album.save();

        return savedAlbum;
      } catch (error) {
        throw new GraphQLError(
          `Error adding artist to album album: ${error.message}`
        );
      }
    },
    removeArtistFromAlbum: async (_, { _id, artistId }, contextValue) => {
      try {
        validateMogoObjID(_id.trim(), 'album Id');
        validateMogoObjID(artistId.trim(), 'artist Id');
        const album = await Album.findById({
          _id: new mongoose.Types.ObjectId(_id.trim()),
        });
        if (!album) {
          songsHelpers.notFoundWrapper('Album Not Found');
        }
        const artist = await Artist.findById(artistId.trim());
        if (!artist) {
          songsHelpers.notFoundWrapper('artist Not Found');
        }
        album.artists &&
          album.artists.pop({
            artistId: new mongoose.Types.ObjectId(artistId.trim()),
          });
        const savedAlbum = await album.save();
        return savedAlbum;
      } catch (error) {
        throw new GraphQLError(
          `Error removing artist from album album: ${error.message}`
        );
      }
    },

    removeAlbum: async (_, { _id }, context) => {
      try {
        validateMogoObjID(_id.trim(), 'album id');
        const deletedAlbum = await Album.findByIdAndDelete(_id.trim());
        await context.redisClient.del(`album:${_id}`);
        await context.redisClient.del('albums');
        if (!deletedAlbum) {
          throw new Error('Album not found');
        }
        await Song.updateMany({ album: _id }, { album: null });
        return deletedAlbum;
      } catch (error) {
        throw new GraphQLError(`Error deleting album: ${error.message}`);
      }
    },
  },
};
