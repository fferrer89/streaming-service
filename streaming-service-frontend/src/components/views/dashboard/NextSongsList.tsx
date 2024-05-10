'use client';
//@ts-nocheck
import React, { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { gql } from '@apollo/client';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/utils/redux/store';
import { updateCurrentSong, stopSong, Song } from '@/utils/redux/features/song/songSlice';
import { GetUserPlaylists } from '@/utils/graphql/queries';

const TOGGLE_LIKE_SONG = gql`
  mutation ToggleLikeSong($id: ID!, $songId: ID!) {
    toggleLikeSong(_id: $id, songId: $songId) {
      _id
      likes
    }
  }
`;

const ADD_SONG_TO_PLAYLIST = gql`
  mutation AddSongToPlaylist($playlistId: ID!, $songId: ID!) {
    addSongToPlaylist(playlistId: $playlistId, songId: $songId) {
      _id
    }
  }
`;

interface Playlist {
  _id: string;
  title: string;
}

interface NextSongsListProps {
  nextSongs: Song[];
  currentSong?: Song | null; // Make this optional
}

const NextSongsList: React.FC<NextSongsListProps> = ({ nextSongs, currentSong }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [toggleLikeSong] = useMutation(TOGGLE_LIKE_SONG, {
    onCompleted: (data) => {
      if (currentSong && currentSong._id === data.toggleLikeSong._id) {
        dispatch(updateCurrentSong({ ...currentSong, likes: data.toggleLikeSong.likes }));
      }
    }
  });
  const [addSongToPlaylist] = useMutation(ADD_SONG_TO_PLAYLIST);
  const userId = useSelector((state: RootState) => state.user.userId);
  const userType = useSelector((state: RootState) => state.user.userType);
  const dispatch = useDispatch();
  const [showAddToPlaylistModal, setShowAddToPlaylistModal] = useState(false);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState('');

  const { data: playlistsData } = useQuery<{ getPlaylistsByOwner: Playlist[] }>(GetUserPlaylists, {
    variables: { userId },
    skip: !userId
  });

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleLikeSong = (songId: string) => {
    toggleLikeSong({ variables: { id: userId, songId } });
  };

  const handleAddToPlaylist = () => {
    setShowAddToPlaylistModal(true);
  };

  const handleSelectPlaylist = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPlaylistId(event.target.value);
  };

  const handleSubmitAddToPlaylist = () => {
    if (selectedPlaylistId && currentSong?._id) {
      addSongToPlaylist({
        variables: {
          playlistId: selectedPlaylistId,
          songId: currentSong._id
        }
      });
      setShowAddToPlaylistModal(false);
    }
  };

  const handleClosePlayer = () => {
    dispatch(stopSong());
  };

  return (
    <div className="flex justify-between">
      <div className="w-2/3 bg-stone-700 text-white">
        <h3 className="flex justify-between items-center">
          Current Song:
          <div>
            <button
              onClick={toggleCollapse}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
            >
              {isCollapsed ? 'Expand' : 'Collapse'}
            </button>
            <button
              onClick={handleClosePlayer}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Close
            </button>
            <button
              onClick={handleAddToPlaylist}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              Add to Playlist
            </button>
          </div>
        </h3>
        {!isCollapsed && currentSong && (
          <div className="text-white p-4 bg-stone-800">
            <h4 className="text-xl font-bold">{currentSong.title}</h4>
            <p className="text-lg">
              {currentSong.artists && currentSong.artists.map((artist) => artist.display_name).join(', ')}
            </p>
            <p className="text-sm">
              Likes: {currentSong.likes ? currentSong.likes : 0}
            </p>
            {userType === 'user' && (
              <button
                onClick={() => handleLikeSong(currentSong._id)}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
              >
                Like
              </button>
            )}
            <p className="text-sm">Album: {currentSong.album?.title}</p>
            <p className="text-sm">
              Released: {currentSong.release_date && new Date(currentSong.release_date).toLocaleDateString()}
            </p>
            <p className="text-sm">Genre: {currentSong.genre}</p>
            <p className="text-sm">
              Lyrics: {currentSong.lyrics ? currentSong.lyrics : 'Lyrics not available'}
            </p>
          </div>
        )}
      </div>
      <div className="w-1/3 overflow-y-auto max-h-96 bg-gray-200 text-black">
        {nextSongs.length > 0 && <h3>Next Song: {nextSongs[0].title}</h3>}
        {!isCollapsed && (
          <div className="grid grid-cols-auto-fill gap-2.5">
            {nextSongs.map((song) => (
              <div
                key={song._id}
                className={`p-2.5 border border-stone-800 rounded hover:bg-gray-300 ${
                  song._id === currentSong?._id ? 'font-bold bg-gray-200' : 'bg-gray-200'
                } shadow-sm`}
              >
                {song.title}
              </div>
            ))}
          </div>
        )}
      </div>
      {showAddToPlaylistModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-10 flex justify-center items-center bg-stone-400"
          onClick={() => setShowAddToPlaylistModal(false)}
        >
          <div className="bg-stone-700 p-4 rounded" onClick={(e) => e.stopPropagation()}>
            <h3>Add to Playlist</h3>
            <select onChange={handleSelectPlaylist} value={selectedPlaylistId} className="bg-stone-700 mb-4">
              <option value="">Select</option>
              {playlistsData?.getPlaylistsByOwner.map((playlist) => (
                <option key={playlist._id} value={playlist._id}>
                  {playlist.title}
                </option>
              ))}
            </select>
            <div className="flex justify-between space-x-4">
              <button onClick={handleSubmitAddToPlaylist} className="flex-1">
                Add
              </button>
              <button onClick={() => setShowAddToPlaylistModal(false)} className="flex-1">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NextSongsList;