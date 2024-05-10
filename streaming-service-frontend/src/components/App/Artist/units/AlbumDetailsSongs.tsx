import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useMutation, useQuery } from "@apollo/client";
import queries from "@/utils/queries";
import SuccessModal from "../SuccessModal";
import { useSelector } from "react-redux";
const AlbumDetailsSongs: React.FC<{
  songs: any;
  refetch: any;
  albumId: any;
}> = ({ songs, refetch : albumRefetch, albumId }) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [songToRemove, setSongToRemove] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [error, setError] = useState("");
  const [selectedSongId, setSelectedSongId] = useState("");
  const [m, setM] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [removeSongFromAlbum] = useMutation(queries.REMOVE_SONG_FROM_ALBUM);
  const [addSongToAlbum] = useMutation(queries.ADD_SONG_TO_ALBUM);
  const artistId = useSelector(
    (state: { user: { userId: string | null } }) => state.user.userId
  );
  const {
    loading: songsLoading,
    error: songsError,
    data: songData,
    refetch
  } = useQuery(queries.GET_SONGS_BY_ARTIST, {
    variables: { artistId: artistId },
    fetchPolicy: "cache-and-network"
  });

  const handleRemoveSong = (songId: string) => {
    setSongToRemove(songId);
    setShowConfirmation(true);
  };
  const handleAddSong = () => {
    setSelectedSongId("");
    setShowAddForm(true);
    refetch()
  };

  const handleSongChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSongId(event.target.value);
  };

  const confirmRemoveSong = async () => {
    try {
      //console.log("Removing song with ID:", songToRemove, albumId);
      const response = await removeSongFromAlbum({
        variables: { id: albumId, songId: songToRemove },
      });

      if (response.errors && response.errors.length > 0) {
        setError(`Error removing song`);
        console.error("Error removing song:", error);
      } else {
        // console.log("Song removed successfully");
        setSongToRemove("");
        setShowConfirmation(false);
        setM("Song Added successfully");
      setIsSuccess(true);
      setShowSuccess(true);
      }
      albumRefetch()
      
    } catch (error) {
      console.error("Error removing song:", error);
      setSongToRemove("");
      setShowConfirmation(false);
      setM("Song Removed successfully");
      setIsSuccess(false);
      setShowSuccess(true);
    }
  };

  const confirmAddSong = async () => {
    if (!selectedSongId) {
      console.error("No song selected");
      // setM("No song selected");
      // setIsSuccess(false);
      // setShowSuccess(true);
      return;
    }
    try {
      const response = await addSongToAlbum({
        variables: { id: albumId, songId: selectedSongId },
      });

      if (response.errors && response.errors.length > 0) {
        setSelectedSongId("");
        setIsSuccess(false);
        setShowSuccess(true);
        setM("Error Adding Song");
      } else {
        // console.log("Song Added successfully");
        setSelectedSongId("");
        setShowAddForm(false);
        setM("Song Added successfully");
        setIsSuccess(true);
        setShowSuccess(true);
      }
      albumRefetch()
     
    } catch (error) {
      console.error("Error Adding song:", error);
      setSelectedSongId("");
      setIsSuccess(false);
      setM("Error Adding Song");
      setShowAddForm(false);
      setShowSuccess(true);
      
    }
  };

  const cancelRemoveSong = () => {
    setSongToRemove("");
    setShowConfirmation(false);
  };

  const cancelAddSong = () => {
    setShowAddForm(false);
  };

  const closeSuccess = () => {
    setShowSuccess(false);
  };

  useEffect(() => {
    if (songData && songData.getSongsByArtistID.length > 0) {
      setSelectedSongId(songData.getSongsByArtistID[0]._id);
    } else {
      setSelectedSongId(""); 
    }
  }, [songData]);

  if (songsLoading) {
    return <div>Loading</div>;
  }
  if (songsError) {
    return (
      <SuccessModal
        isSuccess={false}
        message={`Error Loading Songs List: ${songsError.message}`}
        onClose={closeSuccess}
      />
    );
  }
  return (
    <div className="w-full max-w-md p-4 bg-stone-300 border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700 h-2/12">
      <div className="flex items-center justify-between mb-4">
        <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">
          Songs
        </h5>
        <button
          className="ml-2 text-sm font-medium text-blue-600 hover:text-blue-900 focus:outline-none dark:text-blue-500"
          onClick={() => handleAddSong()}
        >
          Add
        </button>
      </div>
      <div className="flow-root ">
        <ul
          role="list"
          className="divide-y divide-gray-200 dark:divide-gray-700 "
        >
          {songs.map((song: any) => (
            <li key={song._id} className="py-3 sm:py-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <img
                    className="w-8 h-8 rounded-full"
                    src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/file/download/${song.cover_image_url}`}
                    alt={song.title}
                  />
                </div>
                <div className="flex-1 min-w-0 ms-4">
                  <Link
                    href={`/artist/songs/${song._id}`}
                    className="text-sm font-medium text-gray-900 truncate dark:text-white"
                  >
                    {song.title}
                  </Link>
                </div>
                <button
                  className="ml-2 text-sm font-medium text-red-600 hover:text-red-900 focus:outline-none dark:text-red-500"
                  onClick={() => handleRemoveSong(song._id)}
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
      {showConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-gray-200 p-4 rounded-lg shadow-lg text-black">
            <p>Are you sure you want to remove this song?</p>
            <div className="mt-4 flex justify-end">
              {error && <div>{error}</div>}
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-md mr-2 hover:bg-red-600"
                onClick={confirmRemoveSong}
              >
                Confirm
              </button>
              <button
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
                onClick={cancelRemoveSong}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {showSuccess && (
        <SuccessModal
          isSuccess={isSuccess}
          message={m}
          onClose={closeSuccess}
        />
      )}

      {songData && showAddForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-gray-200 p-4 rounded-lg shadow-lg text-black">
            <p>Select a Song to add:</p>
            <select value={selectedSongId} onChange={handleSongChange} disabled={!songData.getSongsByArtistID.length}>
              <option value="">Select song</option>
              {songData.getSongsByArtistID
                .filter((song: any) => song.album === null)
                .map((song: any) => (
                  <option key={song._id} value={song._id}>
                    {song.title}
                  </option>
                ))}
            </select>
            <div className="mt-4 flex justify-end">
              <button
                className="px-4 py-2 bg-green-500 text-white rounded-md mr-2 hover:bg-green-600"
                onClick={confirmAddSong}
              >
                Add
              </button>
              <button
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
                onClick={cancelAddSong}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlbumDetailsSongs;
