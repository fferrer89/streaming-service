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
import { playlistResolvers } from "./graphql/playListResolvers.js";
import redis from "redis";
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
