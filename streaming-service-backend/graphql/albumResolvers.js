import { GraphQLError } from 'graphql';
import Album from '../models/albumModel.js';
import mongoose from 'mongoose';
import Song from '../models/songModel.js';
import Artist from '../models/artistModel.js';
import songsHelpers from '../utils/songsHelpers.js';
import { validateMogoObjID } from '../utils/helpers.js';
import SongFile from '../models/songFileModel.js';
import User from '../models/userModel.js';
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
    },
  },
  Query: {
    albums: async () => {
      try {
        const allAlbums = await Album.find();
        return allAlbums;
      } catch (error) {
        throw new GraphQLError(`Failed to fetch albums: ${error.message}`);
      }
    },
    getAlbumById: async (_, { _id }, contextValue) => {
      try {
        validateMogoObjID(_id.trim(), 'album id');
        const album = await Album.findById(_id.trim());
        return album;
      } catch (error) {
        throw new GraphQLError(`Failed to fetch album: ${error.message}`);
      }
    },
    getAlbumsByTitle: async (_, { title, limit = 10 }, contextValue) => {
      try {
        const albums = await Album.find({
          title: { $regex: new RegExp(title.trim(), 'i') },
          visibility: 'PUBLIC'
        }).limit(limit);
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
    getNewlyReleasedAlbums: async (_, { limit = 10 }, contextValue) => {
      try {
        const albums = await Album.find()
          .sort({ release_date: -1 })
          .limit(limit); // Sort by release date, newest first
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
        for (const s of songs) {
          const songData = await Song.findById(s);
          if (!songData) {
            songsHelpers.notFoundWrapper(`Song not found with ID ${s}`);
          }
        }
        for (const a of artists) {
          const artistData = await Artist.findById(a);
          if (!artistData) {
            songsHelpers.notFoundWrapper(`Artist not found with ID ${a}`);
          }
        }
        const sampleImage = await SongFile.findOne({
          filename: 'sample_album_image',
        }).fileId;

        const newAlbum = new Album({
          title,
          description,
          release_date,
          cover_image_url: cover_image_url || sampleImage,
          genres,
          album_type,
          visibility,
          artists: artistIds,
          songs: songIds,
        });

        const savedAlbum = await newAlbum.save();

        for (const s of songs) {
          const songData = await Song.findOne({
            _id: new mongoose.Types.ObjectId(s),
          });
          songData.album = savedAlbum.id;
          songData.save();
        }

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
        song.album = new mongoose.Types.ObjectId(_id.trim());
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

        const songIndex = album.songs.findIndex(
          (song) => song.songId.toString() === songId.trim()
        );
        if (songIndex === -1) {
          songsHelpers.notFoundWrapper('Song Not Found');
        }

        album.songs.splice(songIndex, 1);

        const savedAlbum = await album.save();

        const song = await Song.findById(songId.trim());
        if (song) {
          song.album = null;
          await song.save();
        }

        return savedAlbum;
      } catch (error) {
        throw new GraphQLError(
          `Error removing song from album: ${error.message}`
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
        const artistIndex = album.artists.findIndex(
          (artist) => artist.artistId.toString() === artistId.trim()
        );
        if (artistIndex === -1) {
          songsHelpers.notFoundWrapper('Artist Not Found in Album');
        }
        album.artists.splice(artistIndex, 1); // Remove the artist at artistIndex
        const savedAlbum = await album.save();
        return savedAlbum;
      } catch (error) {
        throw new GraphQLError(
          `Error removing artist from album album: ${error.message}`
        );
      }
    },

    removeAlbum: async (_, { _id }, contextValue) => {
      try {
        validateMogoObjID(_id.trim(), 'album id');
        const deletedAlbum = await Album.findByIdAndDelete(_id.trim());
        if (!deletedAlbum) {
          throw new Error('Album not found');
        }
        await Song.updateMany({ album: _id }, { album: null });
        return deletedAlbum;
      } catch (error) {
        throw new GraphQLError(`Error deleting album: ${error.message}`);
      }
    },

    toggleLikeAlbum: async (_, { _id, albumId }, contextValue) => {
      try {
        validateMogoObjID(_id.trim(), 'user or artist id');
        validateMogoObjID(albumId.trim(), 'album id');

        const album = await Album.findById(albumId.trim());
        if (!album) {
          throw new Error('Album not found');
        }

        const isUser = await User.findById(_id.trim());
        const isArtist = await Artist.findById(_id.trim());

        if (!isUser && !isArtist) {
          throw new Error('ID does not belong to a valid user or artist');
        }

        const likeType = isUser ? 'users' : 'artists';
        const likeIndex = album.liked_by[likeType].findIndex(
          (like) => like.toString() === _id.trim()
        );

        if (likeIndex === -1) {
          // Like the album if not already liked
          album.liked_by[likeType].push(_id.trim());
        } else {
          // Unlike the album if already liked
          album.liked_by[likeType].splice(likeIndex, 1);
        }

        const savedAlbum = await album.save();
        return savedAlbum;
      } catch (error) {
        throw new GraphQLError(
          `Error toggling like on album: ${error.message}`
        );
      }
    },
  },
};
