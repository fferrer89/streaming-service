import { GraphQLError } from 'graphql';
import Album from '../models/albumModel.js';
import mongoose from 'mongoose';
import Song from '../models/songModel.js';
import Artist from '../models/artistModel.js';

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
        const album = await Album.findById(_id);
        return album;
      } catch (error) {
        throw new GraphQLError(`Failed to fetch album: ${error.message}`);
      }
    },
    getAlbumsByTitle: async (_, { title }, contextValue) => {
      try {
        const albums = await Album.find({ title: title });
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
    getAlbumsByReleasedYear: async (_, { year }, contextValue) => {
      try {
        const albums = await Album.find({
          release_date: {
            $gte: new Date(year, 0, 1), // Start of the year
            $lt: new Date(year + 1, 0, 1), // End of the year
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
        const albumsByArtist = await Album.find({
          'artists.artistId': { $in: new mongoose.Types.ObjectId(artistId) }, // change this part
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
        const newAlbum = new Album({
          ...args, // Spread all input arguments
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
      // TODO
    },
    removeSongFromAlbum: async (_, { _id, songId }, contextValue) => {
      // TODO
    },

    removeAlbum: async (_, { _id }, contextValue) => {
      try {
        const deletedAlbum = await Album.findByIdAndDelete(_id);
        if (!deletedAlbum) {
          throw new Error('Album not found');
        }
        return deletedAlbum;
      } catch (error) {
        throw new GraphQLError(`Error deleting album: ${error.message}`);
      }
    },
  },
};
