import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import mongoose from "mongoose";
import lodash from "lodash";
import { typeDefs } from "./graphql/typeDefs.js";
import { userResolvers } from "./graphql/userResolvers.js";
import { artistResolvers } from "./graphql/artistResolvers.js";
import { albumResolvers } from "./graphql/albumResolvers.js";
import { songResolvers } from "./graphql/songResolvers.js";
import { playlistResolvers } from "./graphql/playlistResolvers.js";
import redis from "redis";
import jwt from "jsonwebtoken";
import { GraphQLError } from "graphql";

const client = redis.createClient();

const server = new ApolloServer({
  typeDefs,
  resolvers: lodash.merge(
    userResolvers,
    artistResolvers,
    albumResolvers,
    songResolvers,
    playlistResolvers
  ),
  // includeStacktraceInErrorResponses: false,
});

try {
  const connection = await mongoose.connect(
    "mongodb://127.0.0.1:27017/streaming-service",
    {
      useNewUrlParser: true,
    }
  );
  await client
    .connect()
    .then(() => {})
    .catch((error) => {
      throw new Error(`Redis Client failed to connect`);
    });
  if (connection) {
    const { url } = await startStandaloneServer(server, {
      listen: { port: 4000 },
      context: async ({ req, res }) => {
        if(req.body.operationName != "registerUser" &&  req.body.operationName != "loginUser"){
          const token = req.headers.authorization || '';
          try {
            var decoded = jwt.verify(token,  process.env.JWT_SECRET);
            if(decoded.exp<=Math.floor(Date.now() / 1000)){
              throw new GraphQLError('You are not authorized. Please login or sign up', {
                extensions: {
                  code: 'FORBIDDEN',
                },
              }); 
            }
          } catch(error) {
            throw new GraphQLError('You are not authorized. Please login or sign up', {
              extensions: {
                code: 'FORBIDDEN',
              },
            });      
          }
          return {decoded};
        }
      },
    });
    console.log("");
    console.log("-------------------------------------------------");
    console.log(`🚀  Server ready at: ${url}`);
    console.log("-------------------------------------------------");
  } else {
    throw new Error(`Failed connecting to MongoDB`);
  }
} catch (error) {
  console.log("");
  console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
  console.log(error.message);
  console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
  process.exit(1);
}
