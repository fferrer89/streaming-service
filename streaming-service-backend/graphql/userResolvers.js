import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { GraphQLError } from 'graphql';
import { generateToken, validateMogoObjID } from '../utils/helpers.js';
import songHelper from '../utils/songsHelpers.js';

export const userResolvers = {
  Query: {
    users: async (_, args, context) => {
      try {
        const cachedUsers = await context.redisClient.json.get('users');
        if (cachedUsers) {
          return cachedUsers;
        }
        const allUsers = await User.find();
        if (allUsers && allUsers.length !== 0) {
          await context.redisClient.json.set('users', '$', allUsers);
          await context.redisClient.EXPIRE('users', 1800);
          return allUsers;
        } else {
          return [];
        }
      } catch (error) {
        throw new GraphQLError(`Failed to fetch users: ${error.message}`);
      }
    },
    getUserById: async (_, args, context) => {
      try {
        validateMogoObjID(args._id, '_id');
        const cachedUser = await context.redisClient.json.get(
          `user:${args._id}`
        );
        if (cachedUser) {
          return cachedUser;
        }
        const user = await User.findById(args._id);
        if (!user) {
          songHelper.notFoundWrapper('Uer not found');
        }
        await context.redisClient.json.set(`user:${args._id}`, '$', user);
        await context.redisClient.EXPIRE(`user:${args._id}`, 1800);
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
