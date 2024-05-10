import { Types } from 'mongoose';
import Playlists from '../models/playlistModel.js';
import Song from '../models/songModel.js';
import User from '../models/userModel.js';
import songsHelpers from '../utils/songsHelpers.js';
import Artist from '../models/artistModel.js';

export const playlistResolvers = {
  Query: {
    // Playlist querys
    playlists: async (_, args, context) => {
      try {
        let response = await Playlists.find({});
        let filteredPlaylist = response.filter((playlist) => {
          if (
            context.decoded &&
            context.decoded.id &&
            context.decoded.id === playlist.owner.toString()
          ) {
            // if user is logged in then return playlist where ower id matches;
            return true;
          } else {
            if (playlist.visibility == 'PUBLIC') {
              //if not logged in then return only public playlist
              return true;
            }
            return false;
          }
        });
        return filteredPlaylist;
      } catch (error) {
        console.log(error);
      }
    },
    getPlaylistById: async (_, args, context) => {
      let playlist = await Playlists.findById(args._id);
      if (!playlist) songsHelpers.notFoundWrapper('Playlist not found');

      if (playlist.visibility == 'PRIVATE') {
        if (
          context.decoded &&
          context.decoded.id &&
          playlist.owner != context.decoded.id
        ) {
          songsHelpers.notFoundWrapper('Playlist not found');
        }
      }
      return playlist;
    },

    getPlaylistsByTitle: async (_, { searchTerm, limit = 10 }, context) => {
      //let { searchTerm, limit } = args;

      searchTerm = songsHelpers.emptyValidation(searchTerm, 'Search Term');

      let playlists = await Playlists.find({
        title: { $regex: new RegExp(searchTerm, 'i') },
      }).limit(limit);

      let filteredPlaylist = playlists.filter((playlist) => {
        if (playlist.visibility == 'PUBLIC') {
          //if not logged in then return only public playlist
          return true;
        }
        return false;
      });

      if (filteredPlaylist.length < 1) {
        songsHelpers.notFoundWrapper('Playlist not not found');
      }
      return filteredPlaylist;
    },
    getMostLikedPlaylists: async (_, { limit = 10 }, contextValue) => {
      try {
        const mostLikedPlaylist = await Playlists.find({ visibility: 'PUBLIC' })
          .sort({ likes: -1 })
          .limit(limit);
        return mostLikedPlaylist;
      } catch (error) {
        console.log(error);
      }
    },
    getPlaylistsByOwner: async (_, args) => {
      let { userId } = args;
      userId = songsHelpers.validObjectId(userId, 'User Id');
      let playlists = await Playlists.find({
        owner: new Types.ObjectId(userId),
      });
      return playlists;
    },

    getUserLikedPlaylists: async (_, args, context) => {
      if (!context.decoded || !context.decoded.id) {
        songsHelpers.unAuthorizedWrapper(
          'Please login to access the playlist you liked'
        );
      }
      let userId = context.decoded.id;
      let role = context.decoded.role;

      let query =
        role === 'ARTIST'
          ? { 'liked_artists.artistId': new Types.ObjectId(userId) }
          : { 'liked_users.userId': new Types.ObjectId(userId) };

      let playlists = await Playlists.find(query);

      let filteredPlaylist = playlists.filter((playlist) => {
        if (userId === playlist.owner.toString()) {
          // if owned by user
          return true;
        } else {
          if (playlist.visibility == 'PUBLIC') {
            //not owned by user
            return true;
          }
          return false;
        }
      });
      return filteredPlaylist;
    },

    getPlaylistsByVisibility: async (_, args) => {
      let { visibility } = args;
      //TODO;
    },
  },
  Playlist: {
    songs: async (parent) => {
      try {
        let songIds = parent.songs.map((id) => new Types.ObjectId(id));
        let songs = await Song.find({ _id: { $in: songIds } });
        // console.log(songIds);
        return songs;
      } catch (error) {
        console.log(error);
      }
    },
    owner: async (parent) => {
      // console.log(parent);
      try {
        let ownerEntity = await User.findById(parent.owner);
        let ownerType = 'User';
        if (!ownerEntity) {
          ownerEntity = await Artist.findById(parent.owner);
          ownerType = 'Artist';
        }
        if (ownerEntity) {
          return {
            _id: ownerEntity._id,
            typename: ownerType,
            first_name: ownerEntity.first_name,
            last_name: ownerEntity.last_name,
            display_name: ownerEntity.display_name,
            profile_image_url: ownerEntity.profile_image_url,
          };
        }
        return null;
      } catch (error) {
        console.log(error);
        return null;
      }
    },
    isLiked: async (parent, _, context) => {
      if (context && context.decoded && context.decoded.role === 'USER') {
        let users = parent.liked_users;
        for (let i = 0; i < users.length; i++) {
          if (users[i].userId.toString() == context.decoded.id) {
            return true;
          }
        }
      } else if (
        context &&
        context.decoded &&
        context.decoded.role === 'ARTIST'
      ) {
        let artists = parent.liked_artists;
        for (let i = 0; i < artists.length; i++) {
          if (artists[i].artistId.toString() == context.decoded.id) {
            return true;
          }
        }
      }
      return false;
    },
    isOwner: async (parent, _, context) => {
      //console.log(parent.owner, context.decoded.id);
      if (
        context &&
        context.decoded &&
        parent.owner.toString() === context.decoded.id
      ) {
        return true;
      }
      return false;
    },
  },

  Mutation: {
    // Playlist mutations
    createPlaylist: async (_, args, context) => {
      if (!context.decoded && !context.decoded.id) {
        songsHelpers.unAuthorizedWrapper('Please login to create playlist');
      }
      let queryObject = {
        ...args,
        liked_users: [],
        liked_artists: [],
        songs: [],
        owner: new Types.ObjectId(context.decoded.id),
        likes: 0,
      };
      try {
        let newPlaylist = new Playlists(queryObject);
        const savedNewPlayist = await newPlaylist.save();
        return savedNewPlayist;
      } catch (error) {
        songsHelpers.badUserInputWrapper(error);
      }
    },
    editPlaylist: async (_, args, context) => {
      if (!context.decoded && !context.decoded.id)
        songsHelpers.unAuthorizedWrapper('Please login to remove playlist');

      let { playlistId } = args;
      let playlistExist = await Playlists.findById(playlistId);
      if (!playlistExist) songsHelpers.notFoundWrapper('Playlist not found');
      // console.log(context.decoded.id);
      if (playlistExist.owner.toString() != context.decoded.id)
        songsHelpers.unAuthorizedWrapper(
          'you are not authorised to edit this playlist'
        );
      if (args.title) {
        playlistExist.title = args.title;
      }
      if (args.description) {
        playlistExist.description = args.description;
      }
      if (args.visibility) {
        playlistExist.visibility = args.visibility;
      }
      const editedPlaylist = await playlistExist.save();
      return editedPlaylist;
    },
    addSongToPlaylist: async (_, args, context) => {
      if (!context.decoded && !context.decoded.id)
        songsHelpers.unAuthorizedWrapper(
          'Please login to add song to playlist'
        );

      let { playlistId, songId } = args;
      let playlistExist = await Playlists.findById(playlistId);
      if (!playlistExist) songsHelpers.notFoundWrapper('Playlist not found');

      let songExist = await Song.findById(songId);
      if (!songExist) songsHelpers.notFoundWrapper('Song not found');

      if (playlistExist.owner.toString() != context.decoded.id)
        songsHelpers.unAuthorizedWrapper(
          'you are not authorised to update this playlist'
        );

      let alreadyInPlaylist;
      for (let i = 0; i < playlistExist.songs.length; i++) {
        if (playlistExist.songs[i] == songExist._id) {
          alreadyInPlaylist = true;
        }
      }
      if (alreadyInPlaylist) {
        songsHelpers.badUserInputWrapper('This song already in the playlist');
      }

      try {
        //  console.log(playlistExist);
        playlistExist.songs.push(new Types.ObjectId(songId));
        let savedUpdatedPlaylist = await playlistExist.save();
        return savedUpdatedPlaylist;
      } catch (error) {
        console.log(error);
        songsHelpers.serverSideErrorWrapper('could not add song to playlist');
      }
    },

    removeSongFromPlaylist: async (_, args, context) => {
      if (!context.decoded && !context.decoded.id)
        songsHelpers.unAuthorizedWrapper(
          'Please login to remove song from playlist'
        );

      let { playlistId, songId } = args;
      let playlistExist = await Playlists.findById(playlistId);
      if (!playlistExist) songsHelpers.notFoundWrapper('Playlist not found');

      let songExist = await Song.findById(songId);
      if (!songExist) songsHelpers.notFoundWrapper('Song not found');

      if (playlistExist.owner.toString() != context.decoded.id)
        songsHelpers.unAuthorizedWrapper(
          'you are not authorised to update this playlist'
        );

      try {
        const newSongs = playlistExist.songs.filter(
          (id) => id.toString() != songId
        );
        playlistExist.songs = newSongs;
        let songRemovedFromPlaylist = playlistExist.save();
        return songRemovedFromPlaylist;
      } catch (error) {
        console.log(error);
        songsHelpers.serverSideErrorWrapper(
          'could not remove song to playlist'
        );
      }
    },

    removePlaylist: async (_, args, context) => {
      if (!context || !context.decoded || !context.decoded.id)
        songsHelpers.unAuthorizedWrapper('Please login to remove playlist');

      let { playlistId } = args;
      let playlistExist = await Playlists.findById(playlistId);
      if (!playlistExist) songsHelpers.notFoundWrapper('Playlist not found');
      if (playlistExist.owner.toString() != context.decoded.id)
        songsHelpers.unAuthorizedWrapper(
          'you are not authorised to remove this playlist'
        );

      try {
        let playlistDel = await Playlists.deleteOne({ _id: playlistExist._id });
        return playlistExist;
      } catch (error) {
        songsHelpers.serverSideErrorWrapper('could not delete to playlist');
      }
    },

    toggleLikePlaylist: async (_, args, context) => {
      console.log(args);
      if (!context.decoded || !context.decoded.id)
        songsHelpers.unAuthorizedWrapper('Please login to like this playlist');

      let { playlistId } = args;
      let playlistExist = await Playlists.findById(playlistId);
      if (!playlistExist) songsHelpers.notFoundWrapper('Playlist not found');

      if (context.decoded.role === 'ARTIST') {
        let likedArray = playlistExist.liked_artists;
        let toggleLike = true;
        for (let i = 0; i < likedArray.length; i++) {
          //  console.log(likedArray[i]);
          if (likedArray[i].artistId.toString() == context.decoded.id) {
            toggleLike = false;
            break;
          }
        }
        if (toggleLike) {
          if (playlistExist.liked_artists) {
            playlistExist.liked_artists.push({
              artistId: new Types.ObjectId(context.decoded.id),
            });
          } else {
            playlistExist.liked_artists = [
              {
                artistId: new Types.ObjectId(context.decoded.id),
              },
            ];
          }
        } else {
          playlistExist.liked_artists = playlistExist.liked_artists.filter(
            (obj) => obj.artistId.toString() !== context.decoded.id
          );
        }
      } else {
        let likedArray = playlistExist.liked_users;
        let toggleLike = true;
        for (let i = 0; i < likedArray.length; i++) {
          //  console.log(likedArray[i]);
          if (likedArray[i].userId.toString() == context.decoded.id) {
            toggleLike = false;
            break;
          }
        }
        if (toggleLike) {
          if (playlistExist.liked_users) {
            playlistExist.liked_users.push({
              userId: new Types.ObjectId(context.decoded.id),
            });
          } else {
            playlistExist.liked_users = [
              {
                userId: new Types.ObjectId(context.decoded.id),
              },
            ];
          }
        } else {
          playlistExist.liked_users = playlistExist.liked_users.filter(
            (obj) => obj.userId.toString() !== context.decoded.id
          );
        }
      }

      let savedPlaylist = await playlistExist.save();
      return savedPlaylist;
    },
  },
};
