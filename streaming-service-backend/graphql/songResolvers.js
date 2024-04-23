import Songs from "../models/songModel.js";
import songHelper from "../utils/songsHelpers.js";
import ListenHistory from "../models/listeningHistoryModel.js";
import User from "../models/userModel.js";
import {Types} from "mongoose";
import Artist from "../models/artistModel.js";
import Album from "../models/albumModel.js";


export const songResolvers = {
  Query: {
    songs: async (_, args, context) =>{
      let songs = await Songs.find({}); 
        if(songs.length==0){
          songHelper.notFoundWrapper("Songs Not found");
        }           
        return songHelper.ObjectIdtoString(songs);
    },
    getSongById: async(_, args, context)=>{
      let {_id:id} = args;
      try {
        songHelper.validObjectId(id);
        let song = await Songs.findById(id);
        if(!song){
            throw 'Song Not found';
        }

        return songHelper.ObjectIdtoString(song);
      } catch (error) {
        songHelper.notFoundWrapper(error);
      }
    },

    getSongsByTitle: async(_, args, context)=>{
      let {searchTerm: term} = args;
      term = songHelper.emptyValidation(term, "Title");

      let songs = await Songs.find({title:{$regex: new RegExp(term, "i")}});
      if(songs.length<1){
          songHelper.notFoundWrapper("Song not found")
      }

      return songHelper.ObjectIdtoString(songs);
    },

    getSongsByAlbumID: async(_, args, context)=>{
      let {albumId} = args;
      albumId = songHelper.emptyValidation(albumId, "albumId");
      albumId = songHelper.validObjectId(albumId);
      let songs = await Songs.find({album: albumId});

      if(songs.length == 0){
        songHelper.notFoundWrapper("Songs not found by this album id")
      }
      
    return songHelper.ObjectIdtoString(songs);
   },

   getSongsByArtistID: async(_, args, context)=>{
    let {artistId} = args;

    artistId = songHelper.emptyValidation(artistId, "artistId");
    artistId = songHelper.validObjectId(artistId)

    let songs = await Songs.find({artists: {$eq:artistId }});

    if(songs.length == 0){
      songHelper.notFoundWrapper("Songs not found by this Artist id")
    }
    return songHelper.ObjectIdtoString(songs);
 },

 getSongsByWriter: async(_, args, context)=>{
  let {searchTerm: term} = args;
  term = songHelper.emptyValidation(term, "Writer's name")
  let songs = await Songs.find({writtenBy:{$regex: new RegExp(term, "i")}});
  if(songs.length<1){
    songHelper.notFoundWrapper("Song not found");
  }

  return songHelper.ObjectIdtoString(songs);
},

getSongsByGenre: async(_, args, context)=>{
  let {genre} = args;
  genre = songHelper.emptyValidation(genre, "Genre");
  genre = genre.toLowerCase();
  let songs = await Songs.find({genre: genre});
  if(songs.length<1){
    songHelper.notFoundWrapper("Song not found");
  }
  return songHelper.ObjectIdtoString(songs);
},
getMostLikedSongs: async(_, args, context)=>{
  let songs = await Songs.aggregate( [{ $sort: { likes: -1 } }, { $limit: 10 }]);
  if(songs.length<1){
    return [];
  }
  return songHelper.ObjectIdtoString(songs);
},
getNewlyReleasedSongs:async(_, args, context)=>{
  let songs = await Songs.aggregate([{$sort: { release_date: -1 } }, { $limit: 10 }]);
  if(songs.length<1){
    return [];
  }
  return songHelper.ObjectIdtoString(songs);
 },
 getTrendingSongs: async(_,args, context)=>{ //Not complete;
    const yesterdayDate = new Date(); 
    yesterdayDate.setDate(yesterdayDate.getDate()-1); //last 24 hours


    const group = {$group: {_id: "$songId", countSong: {$sum:1}}};
    const match ={$match: {timestamp: {$gte: yesterdayDate}}};
    const sort ={$sort: {$countSong:1}}
    const limit = {$limit:10};
    const sortByCount = {$sortByCount: "$songId"}
    
    let songsIds = await ListenHistory.aggregate([ match, sortByCount, limit]);
    //YET TO BE TESTED;

 },

 getUserLikedSongs:async(_,args, context)=>{
    let {userId} = args;
    songHelper.emptyValidation(userId, "user id");  

    let likedSongsId =  await User.findById({_id: new Types.ObjectId(userId)}).select("liked_songs");

    if(!likedSongsId){
      songHelper.notFoundWrapper("Not Found"); 
    }

    likedSongsId = likedSongsId.liked_songs.map((song)=>{
      return song.songId;
    });

    let songs = await Songs.find({_id:{$in: likedSongsId}});
    return songHelper.ObjectIdtoString(songs);
  },

  getMostLikedSongsOfArtist: async(_, args, context)=>{
    let {artistId} = args;
    artistId = songHelper.emptyValidation(artistId, "artistId");
    let songs = await Songs.aggregate([{$match: {artists: {$eq: new Types.ObjectId(artistId)}}}, {$sort: { likes: -1 } }, { $limit: 10 }]);

    return songHelper.ObjectIdtoString(songs);
  },
},
 
  Song:{
    album: async(parent)=>{
        let {album: albumId} = parent;
        if(albumId){
          songHelper.validObjectId(albumId)
          let album = await Album.findById(albumId);
          if(!album){
             songHelper.notFoundWrapper("Album not found");
          }
          album._id = album._id.toString(); 
          album.artists = album.artists.length>0? album.artists.map(artist=> artist._id.toString()):[];
          
          album.songs =  album.songs.length>0? album.songs.map(song=> song.songId.toString()):[]; 
          return album;
        }
    },

    artists: async(parent)=>{ 
      let artistIds = parent.artists.map((id)=> new Types.ObjectId(id));
      let artists = await Artist.find({_id:{$in: artistIds}});
      if(!artists){
        songHelper.notFoundWrapper("Artist(s) not found");
      }

      const converToString = (arr) =>{
        return arr.map((val)=> val.toString());
     }

     //converting ObjectId to string;
     return artists.map((artist)=>{
            artist._id = artist._id.toString();
            artist.following.users = converToString(artist.following.users);
            artist.following.artists = converToString(artist.following.artists);
            artist.followers.users = converToString(artist.followers.users);
            artist.followers.artists = converToString(artist.followers.artists);
            return artist;
      });
    }
  },


  Mutation: {
    addSong:async(_, args, context)=>{
      let {artists, album, title, lyrics, duration, song_url, cover_image_url, writtenBy, producers, genre, release_date}= args;
      let queryObject = {artists, title, duration, song_url, cover_image_url, writtenBy, producers, genre, release_date};
      
      //TODO: Check if the user is artist or not.      
      console.log(args);
      if(album){
          songHelper.emptyValidation(album, "album can't be empty spaces");
          songHelper.validObjectId(album)
          let albumExist = await Album.findById(album);
          if(!albumExist){
            songHelper.badUserInputWrapper(`Album not found, ${album}`)
          }

          // check if artist provided here match the artits in album.
          let albumArtistSet = new Set(albumExist.artists.map((art)=>art._id.toString()));

          if(albumArtistSet.size != artists.length){
            songHelper.badUserInputWrapper("Artist do not match with album");
          }
          for(let i =0;i<artists.length;i++){
              if(!albumArtistSet.has(artists[i])){
                songHelper.badUserInputWrapper("Artist do not match with album");
              }
          }
          queryObject.album = album;
      }

      if(lyrics){
          queryObject.lyrics = lyrics
      }
      queryObject.release_date = songHelper.validDate(queryObject.release_date, "Release date");

      //Check if artists exist:
       for(let i =0 ; i<artists.length; i++){
          songHelper.validObjectId(artists[i]);
          let artistExist = await Artist.findById(artists[i]); 
          if(!artistExist){
            songHelper.badUserInputWrapper("Artist does not exist");
          }else if(artistExist._id.toString != context.decoded.id){
              songHelper.unAuthorizedWrapper();
          }
        }
      
      try {
        let newSong = new Songs(queryObject);
        const savedSong = await newSong.save();
        
        //if album id is present then add the song id to ablum collection.
        if(album){
          let albumUpdate = await Album.findByIdAndUpdate(album,  { $push: { songs: newSong._id} },);
        }
        return songHelper.ObjectIdtoString(savedSong);
      } catch (error) {
         songHelper.badUserInputWrapper(error.message);
      }   
    },
    editSong:async(_, args, context)=>{
      let queryObject = {};
      songHelper.validObjectId(args.songId)
      let songExist = await Songs.findById(args.songId);
      if(!songExist){
        songHelper.notFoundWrapper("Song not found");
      }else{ //Are the valid user to edit the song?
        let validUser = false;
        for(let i =0; i<songExist.artists.length; i++){
          if(context.decoded.id == songExist.artists[i].toString()){
            console.log(context.decoded.id,  songExist.artists[i].toString())
            validUser = true;
          }
        }
        if(!validUser){
          songHelper.unAuthorizedWrapper();
        }
      }
     
      if(args.duration){
        if(duration<=0) songHelper.badUserInputWrapper("Duration can't less than or equal to 0");
        queryObject.duration = args.duration;
      }

      if(args.song_url){
        queryObject.song_url= songHelper.validURL(args.song_url);
      }

      if(args.cover_image_url){
        queryObject.cover_image_url = songHelper.validURL(args.cover_image_url);
      }

      if(args.writtenBy){
        queryObject.writtenBy = songHelper.emptyValidation(args.writtenBy, "Writer' name")
        const alphaRegex = /^[a-zA-Z\s]+$/;
        if(!alphaRegex.test(queryObject.writtenBy)) songHelper.badUserInputWrapper("Writer's name can only have letters")
      }
      if(args.genre){
        queryObject.genre = songHelper.validGenre(args.genre);
      }
      if(args.release_date){
        queryObject.release_date = songHelper.validDate(args.release_date, "Release date");
      }

      if(args.title){
        queryObject.title = songHelper.emptyValidation(args.title, "Title");
        const alphaNumericRegex = /^[a-zA-Z0-9\s]+$/;
        if(!alphaNumericRegex.test(queryObject.title)) songHelper.badUserInputWrapper("Title name can only have letters and digits")
      }

      if(args.artists && args.artists.length>0){
        //check if artist exists;
        for(let i =0; i<args.artists.length; i++){
            let id = songHelper.emptyValidation(args.artists[i], "Artist id");
            songHelper.validObjectId(id)
            let artistExist = await Artist.findById(id);
            if(!artistExist){
              songHelper.badUserInputWrapper("Artist Id is incorrect, Artist not found.");
            }
        }
        queryObject.artists = args.artists;
      }
      if(args.producers && args.producers.length>0){
          queryObject.producers = args.producers;
      }
      let {songId} = args;
      try {
        songHelper.validObjectId(songId);
        let songEdited = await Songs.findByIdAndUpdate(args.songId, {$set:queryObject}, {new: true})
        return songHelper.ObjectIdtoString(songEdited);
      } catch (error) {
        songHelper.badUserInputWrapper(error.message);
      }
    }, 
    removeSong: async(_, args, context)=>{
      
      //Song id
      let{songId} = args;
      songId = songHelper.emptyValidation(songId, "song id");
      let songExist;
      try {
        songExist = await Songs.findById(songId);
        if(!songExist){
          songHelper.notFoundWrapper("Song not found");
        }
      } catch (error) {
        songHelper.notFoundWrapper(error); //Incase findById throws array for invalid objectId.

      }
      //Check if user requesting delete is one of the artist;
      let validUser = false;
      for(let i =0; i<songExist.artists.length; i++){
        if(context.decoded.id == songExist.artists[i].toString()){
          console.log(context.decoded.id,  songExist.artists[i].toString())
          validUser = true;
        }
      }
      if(!validUser){
        songHelper.unAuthorizedWrapper();
      }
      
      
      //Remove song from song Collection.
      try {
        let songDel = await Songs.deleteOne({_id: new Types.ObjectId(songId)});
      } catch (error) {
          songHelper.serverSideErrorWrapper("Something went wrong, could not delete song");
      }

      //Remoce song from Album Colleciton.
      try {
        let songDel = await Album.findByIdAndUpdate(songExist.album, {$pull: {songs: songExist._id}});
      } catch (error) {
          songHelper.serverSideErrorWrapper("Something went wrong, could not delete song from album");
      }

      //Remove song from User collection.
      try {
        let songDel = await User.updateMany({liked_songs: {$eq:songExist._id}}, {$pull:{liked_songs: songExist._id}});
      } catch (error) {
        console.log(error);
      }

      //Set Deleted field to true in listening history Collection.
      try {
        let sonfDel =await ListenHistory.updateMany({songId: songExist._id}, {deleted: true});
      } catch (error) {
          console.log(error);
      }

      return songExist;
    },
    toggleLikeSong: async(args)=>{
      
    }
  },


};
