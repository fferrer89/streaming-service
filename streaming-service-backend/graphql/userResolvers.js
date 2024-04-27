import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { GraphQLError } from 'graphql';
import { generateToken, validateMogoObjID } from '../utils/helpers.js';
import songHelper from '../utils/songsHelpers.js';

export const userResolvers = {
  Query: {
    users: async () => {
      try {
        const allUsers = await User.find();
        return allUsers;
      } catch (error) {
        throw new GraphQLError(`Failed to fetch users: ${error.message}`);
      }
    },
    getUserById: async (_, args, contextValue) => {
      try {
        validateMogoObjID(args._id, '_id');
        const user = await User.findById(args._id);
        return user;
      } catch (error) {
        throw new GraphQLError(`Failed to fetch user: ${error.message}`);
      }
    },
  },
  Mutation: {
    registerUser: async (_, args) => {
      try {
        const existingUser = await User.findOne({ email: args.email });
        if (existingUser) {
          throw new GraphQLError('User already exists with this email.');
        }

        const newUser = new User({
          first_name: args.first_name,
          last_name: args.last_name,
          display_name: args.display_name,
          email: args.email,
          password: args.password,
          profile_image_url: args.profile_image_url,
        });

        const validationErrors = newUser.validateSync();

        if (validationErrors) {
          songHelper.badUserInputWrapper(validationErrors);
        }

        const savedUser = await newUser.save();

        const token = generateToken(
          savedUser._id,
          'user',
          savedUser.first_name
        );
        return { user: savedUser, token };
      } catch (error) {
        throw new GraphQLError(`Error Registering user: ${error.message}`, {
          extensions: { code: 'INTERNAL_SERVER_ERROR' },
        });
      }
    },

    loginUser: async (_, args) => {
      try {
        const user = await User.findOne({ email: args.email }).select(
          '+password'
        );
        if (!user) {
          throw new GraphQLError('Invalid email or password.');
        }

        const isPasswordCorrect = await user.isPasswordCorrect(
          args.password,
          user.password
        );
        if (!isPasswordCorrect) {
          throw new GraphQLError('Invalid email or password.');
        }

        const token = generateToken(user._id, 'USER', user.first_name);

        return { user, token };
      } catch (error) {
        throw error;
      }
    },
  },
};
