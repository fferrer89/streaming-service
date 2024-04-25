import Admin from '../models/adminModel.js';
import { generateToken } from '../utils/helpers.js';

export const adminResolver = {
  Query: {

  },
  Mutation: {
    loginAdmin: async (_, args) => {
      try {
        const admin = await Admin.findOne({ email: args.email }).select('+password');

        if (!admin) {
          throw new Error('Invalid email or password');
        }

        const isPasswordCorrect = await admin.isPasswordCorrect(args.password, admin.password);

        if (!isPasswordCorrect) {
          throw new Error('Invalid email or password.');
        }

        const token = generateToken(admin._id, 'ADMIN', admin.first_name);

        return { admin, token };
      } catch (error) {
        return {
          admin: null,
          token: null,
          error: {
            message: 'Error logging in admin',
            details: error.message
          }
        }
      }
    }
  }
};