import dotenv from 'dotenv';

dotenv.config({ path: './.env' });
import environment from './config/config.js';
import { ApolloServer } from 'apollo-server-express';
import fileRoutes from './routes/songFileRoutes.js';
import { startStandaloneServer } from '@apollo/server/standalone';
import mongoose from 'mongoose';
import lodash from 'lodash';
import { typeDefs } from './graphql/typeDefs.js';
// import {enumResolvers} from "./graphql/enumResolvers.js";
import { userResolvers } from './graphql/userResolvers.js';
import { artistResolvers } from './graphql/artistResolvers.js';
import { albumResolvers } from './graphql/albumResolvers.js';
import { songResolvers } from './graphql/songResolvers.js';
import { playlistResolvers } from './graphql/playlistResolvers.js';
import redis from 'redis';
import jwt from 'jsonwebtoken';
import { GraphQLError } from 'graphql';
import express from 'express';
import graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.mjs';
import { authenticateToken } from './utils/helpers.js';
import morgan from 'morgan';
import cors from 'cors';
const redisClient = redis.createClient();

const attachRedisClient = (req, res, next) => {
  req.redisClient = redisClient;
  next();
};

const server = new ApolloServer({
  typeDefs,
  resolvers: lodash.merge(
    userResolvers,
    artistResolvers,
    albumResolvers,
    songResolvers,
    playlistResolvers
  ),
  context: async ({ req, res }) => {
    if (req.body.operationName !== 'IntrospectionQuery') {
      console.log(
        `[GRAPHQL] -- Operation = ${req.body.operationName} -- Status = ${res.statusCode}`
      );
    }
    // will bypass authentication middelware for login, register and playground
    if (
      // Uncomment this part to disable authentication on all queries and mutations
      req.body.operationName.toLowerCase() !== 'mutation' &&
      req.body.operationName.toLowerCase() !== 'query' &&
      req.body.operationName !== 'IntrospectionQuery' &&
      req.body.operationName !== 'registerUser' &&
      req.body.operationName !== 'registerArtist' &&
      req.body.operationName !== 'loginUser' &&
      req.body.operationName !== 'loginArtist'
    ) {
      const token = req.headers.authorization || '';
      try {
        var decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.exp <= Math.floor(Date.now() / 1000)) {
          throw new GraphQLError(
            'You are not authorized. Please login or sign up',
            {
              extensions: {
                code: 'FORBIDDEN',
              },
            }
          );
        }
      } catch (error) {
        throw new GraphQLError(
          'You are not authorized. Please login or sign up',
          {
            extensions: {
              code: 'FORBIDDEN',
            },
          }
        );
      }
      return { decoded, redisClient };
    } else {
      return { redisClient };
    }
  },
  // includeStacktraceInErrorResponses: false,
});

const env = process.env.NODE_ENV || 'development';
const mongoUrl = environment[env].mongoUrl;

try {
  const connection = await mongoose.connect(mongoUrl, {
    useNewUrlParser: true,
  });

  await redisClient
    .connect()
    .then(() => {})
    .catch((error) => {
      throw new Error(`Redis Client failed to connect`);
    });
  if (connection) {
    await server.start();

    //TODO need to add auth middleware for express
    const app = express();
    app.use(express.json());
    app.use(morgan('dev'));
    app.use(cors());
    //app.use(authenticateToken);
    app.use(attachRedisClient);

    app.use('/file', fileRoutes);
    app.use(graphqlUploadExpress());

    server.applyMiddleware({ app });

    await new Promise((r) => app.listen({ port: 4000 }, r));

    console.log('');
    console.log('-------------------------------------------------');
    console.log(
      `🚀 Server ready at http://localhost:4000${server.graphqlPath}`
    );
    console.log('-------------------------------------------------');
    // console.log('');
    // console.log('-------------------------------------------------');
    // console.log(`🚀  Server ready at: ${url}`);
    // console.log('-------------------------------------------------');
  } else {
    throw new Error(`Failed connecting to MongoDB`);
  }
} catch (error) {
  console.log('');
  console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
  console.log(error.message);
  console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
  process.exit(1);
}
