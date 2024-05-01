import Artist from '../models/artistModel.js';
import { GraphQLError } from 'graphql';
import jwt from 'jsonwebtoken';
import Album from '../models/albumModel.js';
import User from '../models/userModel.js';
import { generateToken, validateMogoObjID } from '../utils/helpers.js';
import songHelper from '../utils/songsHelpers.js';

export const artistResolvers = {
  Artist: {
    followers: async (parent) => {
      try {
        const artist = await Artist.findById(parent._id).populate(
          'followers.users followers.artists'
        );
        return artist.followers;
      } catch (error) {
        throw new Error('Failed to fetch followers');
      }
    },
    following: async (parent) => {
      try {
        const artist = await Artist.findById(parent._id).populate(
          'following.users following.artists'
        );
        return artist.following;
      } catch (error) {
        throw new Error('Failed to fetch following');
      }
    },
  },
  Query: {
    artists: async () => {
      try {
        const allArtists = await Artist.find({});
        return allArtists;
      } catch (error) {
        throw new GraphQLError(`Failed to fetch artists: ${error.message}`);
      }
    },
    getArtistById: async (_, args, contextValue) => {
      try {
        validateMogoObjID(args._id, '_id');
        const artist = await Artist.findById(args._id);
        return artist;
      } catch (error) {
        throw new GraphQLError(`Failed to fetch artist: ${error.message}`);
      }
    },
    getArtistsByName: async (_, args, contextValue) => {
      try {
        const artists = await Artist.find({ first_name: args.name });
        return artists;
      } catch (error) {
        throw new GraphQLError(`Failed to fetch artist: ${error.message}`);
      }
    },
    getArtistsByAlbumId: async (_, args, contextValue) => {
      try {
        validateMogoObjID(args.albumId, 'albumId');
        const album = await Album.findById(args.albumId);
        if (!album) {
          throw Error(`Failed to fetch album with id (${args.albumId})`);
        }
        const artistIds = album.artists;
        const artists = await Artist.find({ _id: { $in: artistIds } });
        return artists;
      } catch (error) {
        throw new GraphQLError(`Failed to fetch artist: ${error.message}`);
      }
    },
    getUserFollowedArtists: async (_, args, contextValue) => {
      try {
        const userId = args.userId;
        validateMogoObjID(userId, 'userId');
        const user = await User.findById(userId).populate('followers.artists');

        if (!user) {
          throw new GraphQLError('User not found');
        }

        const followedArtists = user.followers.artists;

        return followedArtists;
      } catch (err) {
        throw new GraphQLError(
          `Failed to get followed artists: ${err.message}`
        );
      }
    },
    getMostFollowedArtists: async (_, args, contextValue) => {
      try {
        const artists = await Artist.find().populate('followers');

        let mostFollowedArtist = null;
        let maxFollowers = 0;
        artists.forEach((artist) => {
          const followersCount =
            artist.followers.artists.length + artist.followers.users.length;

          if (followersCount > maxFollowers) {
            mostFollowedArtist = artist;
            maxFollowers = followersCount;
          }
        });

        return mostFollowedArtist;
      } catch (err) {
        throw new GraphQLError(
          `Failed to get followed artists: ${err.message}`
        );
      }
    },
  },
  Mutation: {
    registerArtist: async (_, args) => {
      try {
        //No need to do manual validations, mongoose will handle everything, you just have to define proper schema for the model in mongoose

        const existingArtist = await User.findOne({ email: args.email });
        if (existingArtist) {
          throw new GraphQLError(`Artist already exists with this email.`);
        }
        const newArtist = new Artist({
          first_name: args.first_name,
          last_name: args.last_name,
          display_name: args.display_name,
          email: args.email,
          password: args.password,
          profile_image_url: args.profile_image_url,
          genres: args.genres,
        });
        const validationErrors = newArtist.validateSync();

        if (validationErrors) {
          songHelper.badUserInputWrapper(validationErrors);
        }
        const savedArtist = await newArtist.save();
        const token = generateToken(
          savedArtist._id,
          'ARTIST',
          savedArtist.first_name
        );
        return { artist: savedArtist, token };
      } catch (error) {
        throw new GraphQLError(`Error Registering Artist: ${error.message}`, {
          extensions: { code: 'INTERNAL_SERVER_ERROR' },
        });
      }
    },
    loginArtist: async (_, args) => {
      try {
        const artist = await Artist.findOne({ email: args.email }).select(
          '+password'
        );

        if (!artist) {
          songHelper.unAuthorizedWrapper('Invalid email or password.');
        }
        const isPasswordCorrect = await artist.isPasswordCorrect(
          args.password,
          artist.password
        );
        if (!isPasswordCorrect) {
          songHelper.unAuthorizedWrapper('Invalid email or password.');
        }
        const token = generateToken(artist._id, 'artist', artist.first_name);
        return { artist, token };
      } catch (error) {
        throw error;
      }
    },
    editArtist: async (_, args, context) => {
      try {
        const { artistId, ...updateData } = args;
        validateMogoObjID(artistId, 'artistId');
        let artist = await Artist.findById(artistId);
        if (
          !context &&
          !context.decoded &&
          artist._id.toString !== context.decoded.id &&
          context.decoded.role !== 'admin'
        ) {
          songHelper.unAuthorizedWrapper();
        }
        if (!artist) {
          songHelper.notFoundWrapper('Artist not found');
        }

        for (const key in updateData) {
          if (updateData[key] !== undefined) {
            artist[key] = updateData[key];
          }
        }

        const validationErrors = artist.validateSync();

        if (validationErrors) {
          songHelper.badUserInputWrapper(validationErrors);
        }
        artist = await artist.save();

        return artist;
      } catch (err) {
        throw err;
      }
    },
  },
};
