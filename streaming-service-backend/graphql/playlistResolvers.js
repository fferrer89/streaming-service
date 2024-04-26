import { Types } from "mongoose";
import Playlists from "../models/playlistModel.js"
import Song from "../models/songModel.js";
import songsHelpers from "../utils/songsHelpers.js";

export const playlistResolvers = {
  Query: {
    // Playlist querys
    playlists: async(_,args)=>{
      try {
          let response = await Playlists.find({});
          return response;
      } catch (error) {
        console.log(error);
      }
    },
    getPlaylistById: async(_,args)=>{
        let response = await Playlists.findById(args._id);
        if(!response) songsHelpers.notFoundWrapper("Playlist not found"); // not found; 
        return response;
    },

    getPlaylistsByTitle: async(_, args, context)=>{
        let{searchTerm} = args; 
        
        searchTerm =  songsHelpers.emptyValidation(searchTerm, "Search Term");

        let playlists = await Playlists.find({
          title: { $regex: new RegExp(term, 'i') }
        });

        let filteredPlaylist = playlists.filter((playlist)=>{ //will give different playlist if user is logged in; 
          if(context.decoded && context.decoded.id && context.decoded.id === playlist.owner.toString()){ // if user is logged in then return playlist where ower id matches;
              return true; 
          }
          else{
            if(playlist.visibility == "PUBLIC"){ //if not logged in then return only public playlist
                return true;
            }
            return false;
          }
        });

        if (filteredPlaylist.length < 1) {
          songsHelpers.notFoundWrapper('Playlist not not found');
        }
        return filteredPlaylist;
    },
    getMostLikedPlaylists: async (_, { limit = 10 }, contextValue) => {
      try {
        const mostLikedPlaylist= await Playlists.find()
          .sort({ likes: -1 }) 
          .limit(limit);
        return mostLikedPlaylist;
      } catch (error) {
        console.log(error);
      }
    },
    getPlaylistsByOwner: async(_, args)=>{
        let {userId} = args;
        userId = songsHelpers.validObjectId(userId, "User Id");
        let playlists = await Playlists.find({owner: new Types.ObjectId(userId)});
        return playlists;
    },
    
    getUserLikedPlaylists: async(_, args)=>{
      let {userId} = args;
        userId = songsHelpers.validObjectId(userId, "User Id");
        let playlists = await Playlists.find({"liked_users.userId": new Types.ObjectId(userId)});
        return playlists;
    },

    getPlaylistsByVisibility:async(_, args)=>{
      let{visibility} = args;
      //TODO;
    },
  },
  Playlists:{
    songs: async(parent)=>{
      try {
        let songIds = parent.artists.map((id) => new Types.ObjectId(id));
        let songs = await Song.find({ _id: { $in: songIds }});
        return songs;
      } catch (error) {
        console.log(error);
      }
    }
  },

  Mutation: {
    // Playlist mutations
  },
};
