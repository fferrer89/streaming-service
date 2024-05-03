import Artist from '../models/artistModel.js';
import { GraphQLError } from 'graphql';
import Album from '../models/albumModel.js';
import User from '../models/userModel.js';
import { generateToken, validateMogoObjID } from '../utils/helpers.js';
import songHelper from '../utils/songsHelpers.js';

export const artistResolvers = {
  Artist: {
    //working fully
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
    //working fully
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
    //working fully
    artists: async (_, args, context) => {
      try {
        const cachedArtists = await context.redisClient.json.get('artists');
        if (cachedArtists) {
          return cachedArtists;
        }

        const allArtists = await Artist.find({});
        if (allArtists && allArtists.length !== 0) {
          await context.redisClient.json.set('artists', '$', allArtists);
          await context.redisClient.EXPIRE('artists', 1800);

          return allArtists;
        } else {
          return [];
        }
      } catch (error) {
        throw new GraphQLError(`Failed to fetch artists: ${error.message}`);
      }
    },
    //working fully
    getArtistById: async (_, args, context) => {
      try {
        validateMogoObjID(args._id, '_id');

        const cachedArtist = await context.redisClient.json.get(`artist:${args._id}`);
        if (cachedArtist) {
          return cachedArtist;
        }

        const artist = await Artist.findById(args._id);
        if (!artist) {
          songHelper.notFoundWrapper('Artist not found');
        }

        await context.redisClient.json.set(`artist:${args._id}`, '$', artist);
        await context.redisClient.EXPIRE(`artist:${args._id}`, 1800);

        return artist;
      } catch (error) {
        throw new GraphQLError(`Failed to fetch artist: ${error.message}`);
      }
    },
    //working fully - used for search
    getArtistsByName: async (_, args, contextValue) => {
      try {
        if (
          !args.name ||
          typeof args.name !== 'string' ||
          args.name.trim().length < 3
        ) {
          songHelper.badUserInputWrapper(
            'Please provide at least 3 characters for name input'
          );
        }
        const artists = await Artist.find({
          $or: [
            { display_name: { $regex: new RegExp(args.name, 'i') } },
            { first_name: { $regex: new RegExp(args.name, 'i') } },
            { last_name: { $regex: new RegExp(args.name, 'i') } },
          ]
        });
        return artists;
      } catch (error) {
        throw new GraphQLError(`Failed to fetch artist: ${error.message}`, {
          extensions: {
            code: error.extensions.code,
          },
        });
      }
    },
    //working fully
    getArtistsByAlbumId: async (_, args, contextValue) => {
      try {
        if (
          !args.albumId ||
          typeof args.albumId !== 'string' ||
          args.albumId.trim().length === 0
        ) {
          songHelper.badUserInputWrapper('Please provide valid id for album');
        }

        validateMogoObjID(args.albumId.trim(), 'albumId');
        const album = await Album.findById(args.albumId.trim()).lean();

        if (!album) {
          throw Error(`Failed to fetch album with id (${args.albumId.trim()})`);
        }

        const artistIds = album.artists.map((artist) => artist.artistId);
        const artists = await Artist.find({ _id: { $in: artistIds } });
        return artists;
      } catch (error) {
        throw new GraphQLError(`Failed to fetch artist: ${error.message}`);
      }
    },
    //working fully
    getUserFollowedArtists: async (_, args, contextValue) => {
      try {
        let userId = args.userId;
        if (
          !userId ||
          typeof userId !== 'string' ||
          userId.trim().length === 0
        ) {
          songHelper.badUserInputWrapper('Please provide valid id for user');
        }
        userId = userId.trim();
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
    //working fully - returns top N most followed artists based on input N
    getMostFollowedArtists: async (_, args, contextValue) => {
      try {
        let top = args.top;
        if (!top || top < 1) {
          top = 10;
        }
        const artists = await Artist.find().populate('followers');

        artists.sort((a, b) => {
          const followersCountA =
            a.followers.artists.length + a.followers.users.length;
          const followersCountB =
            b.followers.artists.length + b.followers.users.length;
          return followersCountB - followersCountA;
        });

        const topNMostFollowedArtists = artists.slice(0, top);

        return topNMostFollowedArtists;
      } catch (err) {
        throw new GraphQLError(
          `Failed to get followed artists: ${err.message}`
        );
      }
    },
  },
  Mutation: {
    //working fully
    registerArtist: async (_, args) => {
      try {
        //No need to do manual validations, mongoose will handle everything, you just have to define proper schema for the model in mongoose

        const existingArtist = await Artist.findOne({ email: args.email });
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
    removeArtist: async (_, args, context) => {
      try {
        validateMogoObjID(args.artistId.trim(), 'artist id');
        const deletedArtist = await Artist.findByIdAndDelete(args.artistId.trim());

        await context.redisClient.del(`artist:${args.artistId}`);
        await context.redisClient.del('artists');

        if (!deletedArtist) {
          songHelper.notFoundWrapper('Artist not found');
        }

        return deletedArtist;
      } catch (error) {
        throw new GraphQLError(`Error deleting artist: ${error.message}`)
      }
    }
  },
};
