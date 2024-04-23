import Artist from "../models/artistModel.js";
import {GraphQLError} from "graphql";
import jwt from "jsonwebtoken";
import Album from "../models/albumModel.js";
import User from "../models/userModel.js";

const generateToken = (artistId) => {
  return jwt.sign({id: artistId}, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION_TIME,
  });
};
export const artistResolvers = {
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
        const artist = await Artist.findById(args._id);
        return artist;
      } catch (error) {
        throw new GraphQLError(`Failed to fetch artist: ${error.message}`);
      }
    },
    getArtistByName: async (_, args, contextValue) => {
      try {
        const artist = await Artist.findOne({ first_name: args.name});
        return artist;
      } catch (error) {
        throw new GraphQLError(`Failed to fetch artist: ${error.message}`);
      }
    },
    getArtistsByAlbumId: async (_, args, contextValue) => {
      try {
        // 1. Retrieve the album:
        const album = await Album.findById(args.albumId);
        if (!album) {
          throw Error(`Failed to fetch album with id (${args.albumId})`);
        }
        // 2. Get artist IDs from the album
        const artistIds = album.artists;
        // 3. Find all artists using the IDs
        const artists = await Artist.find({ _id: { $in: artistIds } });
        return artists;
      } catch (error) {
        throw new GraphQLError(`Failed to fetch artist: ${error.message}`);
      }
    },
    getUserFollowedArtists: async (_, args, contextValue) => {
      // TODO
    }
  },
  Mutation: {
    registerArtist: async (_, args) => {
      try {
        // 1. Input Validation:
        //    - Check for required fields
        //    - Validate email format, password strength, etc. (you'll need additional libraries / functions for this)

        // 2. Check if an artist with the email already exists:
        const existingArtist = await User.findOne({email: args.email});
        if (existingArtist) {
          throw new Error(`Artist already exists with this email.`);
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
        const savedArtist = await newArtist.save();
        const token = generateToken(savedArtist._id);
        return {artist: savedArtist, token};
      } catch (error) {
        throw new GraphQLError(`Error Registering Artist: ${error.message}`, {
          extensions: {code: "INTERNAL_SERVER_ERROR"},
        });
      }
    },
    loginArtist: async (_, args) => {
      try {
        const artist = await Artist.findOne({email: args.email}).select(
            "+password"
        );
        if (!artist) {
          throw new Error("Invalid email or password.");
        }
        const isPasswordCorrect = await artist.isPasswordCorrect(
            args.password,
            artist.password
        );
        if (!isPasswordCorrect) {
          throw new Error("Invalid email or password.");
        }
        const token = generateToken(artist._id);
        return {artist, token};
      } catch (error) {
        return {
          artist: null,
          token: null,
          error: {
            message: "Error logging in artist",
            details: error.message,
          },
        };
      }
    },
    editArtist: async (_, args) => {
      // TODO
    },
  },
};
