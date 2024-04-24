import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { GraphQLError } from 'graphql';
import { generateToken } from '../utils/helpers.js';

export const userResolvers = {
  Query: {
    users: async () => {
      try {
        const allUsers = await User.find();
        return allUsers;
      } catch (error) {
        throw new Error(`Failed to fetch users: ${error.message}`);
      }
    },
  },
  Mutation: {
    registerUser: async (_, args) => {
      try {
        const existingUser = await User.findOne({ email: args.email });
        if (existingUser) {
          throw new Error('User already exists with this email.');
        }

        const newUser = new User({
          first_name: args.first_name,
          last_name: args.last_name,
          display_name: args.display_name,
          email: args.email,
          password: args.password,
          profile_image_url: args.profile_image_url,
        });

        const savedUser = await newUser.save();

        const token = generateToken(
          savedUser._id,
          'USER',
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
          throw new Error('Invalid email or password.');
        }

        const isPasswordCorrect = await user.isPasswordCorrect(
          args.password,
          user.password
        );
        if (!isPasswordCorrect) {
          throw new Error('Invalid email or password.');
        }

        const token = generateToken(user._id, 'USER', user.first_name);

        return { user, token };
      } catch (error) {
        return {
          user: null,
          token: null,
          error: {
            message: 'Error logging in user',
            details: error.message,
          },
        };
      }
    },
  },
};
