import dotenv from "dotenv";

dotenv.config({path: "./.env"});
import environment from './config/config.js';
import {ApolloServer} from "@apollo/server";
import {startStandaloneServer} from "@apollo/server/standalone";
import mongoose from "mongoose";
import lodash from "lodash";
import {typeDefs} from "./graphql/typeDefs.js";
// import {enumResolvers} from "./graphql/enumResolvers.js";
import {userResolvers} from "./graphql/userResolvers.js";
import {artistResolvers} from "./graphql/artistResolvers.js";
import {albumResolvers} from "./graphql/albumResolvers.js";
import {songResolvers} from "./graphql/songResolvers.js";
import {playlistResolvers} from "./graphql/playlistResolvers.js";
import redis from "redis";

// TODO: uncomment line below to start Redis server
// const client = redis.createClient();

const server = new ApolloServer({
    typeDefs,
    resolvers: lodash.merge(
        // enumResolvers,
        userResolvers,
        artistResolvers,
        albumResolvers,
        songResolvers,
        playlistResolvers
    ),
});

const env = process.env.NODE_ENV || "development";
const mongoUrl = environment[env].mongoUrl;

try {
    const connection = await mongoose.connect(
        mongoUrl,
        {
            useNewUrlParser: true,
        }
    );

    // TODO: uncomment lines below to start Redis server
    // await client
    //   .connect()
    //   .then(() => {})
    //   .catch((error) => {
    //     throw new Error(`Redis Client failed to connect`);
    //   });

    if (connection) {
        const {url} = await startStandaloneServer(server, {
            listen: {port: 4000},
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
