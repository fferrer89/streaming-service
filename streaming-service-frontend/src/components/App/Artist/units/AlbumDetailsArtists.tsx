import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useMutation, useQuery } from "@apollo/client";
import queries from "@/utils/queries";
import { useSelector } from "react-redux";
import SuccessModal from "../SuccessModal";
const AlbumDetailsArtists: React.FC<{
  artists: any;
  refetch: any;
  albumId: any;
}> = ({ artists, refetch, albumId }) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [artistToRemove, setArtistToRemove] = useState("");
  const [error, setError] = useState("");
  const [removeArtistFromAlbum] = useMutation(queries.REMOVE_ARTIST_FROM_ALBUM);
  const [addArtistToAlbum] = useMutation(queries.ADD_ARTIST_TO_ALBUM);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedArtistId, setSelectedArtistId] = useState("");
  const [m, setM] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const artistId = useSelector(
    (state: { user: { userId: string | null } }) => state.user.userId
  );

  const {
    loading: artistLoading,
    error: artistsError,
    data: artistData,
    refetch: artistRefetch
  } = useQuery(queries.GET_ARTISTS);

  const handleRemoveArtist = (songId: string) => {
    setArtistToRemove(songId);
    setShowConfirmation(true);
  };

  const handleAddArtist = () => {
    setSelectedArtistId("");
    artistRefetch()
    setShowAddForm(true);
  };

  const handleArtistChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedArtistId(event.target.value);
  };
  const confirmRemoveArtist = async () => {
    try {
      const response = await removeArtistFromAlbum({
        variables: { id: albumId, artistId: artistToRemove },
      });

      if (response.errors && response.errors.length > 0) {
        setError(`Error removing artist`);
      } else {
        setArtistToRemove("");
        setShowConfirmation(false);
        setM("Removing Artist");
        setShowSuccess(true);
      }
      refetch();
    } catch (error) {
      console.error("Error removing artist:", error);
      setIsSuccess(false);
      setM("Error removing Artist");
      setShowConfirmation(false);
      setShowSuccess(true);
    }
  };

  const confirmAddArtist = async () => {
    if (!selectedArtistId) {
      console.error("No song selected");
      return;
    }
    try {
      const response = await addArtistToAlbum({
        variables: { id: albumId, artistId: selectedArtistId },
      });
      console.log(response);
      if (response.errors && response.errors.length > 0) {
        setIsSuccess(false);
        setM("Error Adding Artist");
        setShowAddForm(false);
        setShowSuccess(true);
      } else {
        setSelectedArtistId("");
        setShowAddForm(false);
        setM("Artist Added successfully");
        setIsSuccess(true);
        setShowSuccess(true);
      }
      refetch();
    } catch (error) {
      console.error("Error adding artist:", error);
      setIsSuccess(false);
      setM("Error Adding Artist");
      setShowAddForm(false);
      setShowSuccess(true);
    }
  };

  const cancelAddArtist = () => {
    setShowAddForm(false);
  };

  const closeSuccess = () => {
    setShowSuccess(false);
  };

  const cancelRemoveArtist = () => {
    setArtistToRemove("");
    setShowConfirmation(false);
  };

  useEffect(() => {
    if (artistData && artistData.artists.length > 0) {
      setSelectedArtistId(artistData.artists[0]._id);
    } else {
      setSelectedArtistId("");
    }
  }, [artistData]);

  if (artistLoading) {
    return <div>Loading</div>;
  }
  if (artistsError) {
    return (
      <SuccessModal
        isSuccess={false}
        message={`Error Loading Artists List: ${artistsError.message}`}
        onClose={closeSuccess}
      />
    );
  }
  return (
    <div className="w-full max-w-md p-4 bg-stone-300 border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">
          Artists
        </h5>
        <button
          className="ml-2 text-sm font-medium text-blue-600 hover:text-blue-900 focus:outline-none dark:text-blue-500"
          onClick={() => handleAddArtist()}
        >
          Add
        </button>
      </div>
      <div className="flow-root">
        <ul
          role="list"
          className="divide-y divide-gray-200 dark:divide-gray-700"
        >
          {artistData &&
            artists.map((artist: any) => (
              <li key={artist._id} className="py-3 sm:py-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <img
                      className="w-8 h-8 rounded-full"
                      src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/file/download/${artist.profile_image_url}`}
                      alt={artist.display_name}
                    />
                  </div>
                  <div className="flex-1 min-w-0 ms-4">
                    <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                      {artist.display_name}
                    </p>
                  </div>
                  {artistId !== artist._id && (
                    <button
                      className="ml-2 text-sm font-medium text-red-600 hover:text-red-900 focus:outline-none dark:text-red-500"
                      onClick={() => handleRemoveArtist(artist._id)}
                    >
                      Remove
                    </button>
                  )}
                </div>
              </li>
            ))}
        </ul>
      </div>
      {showConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-gray-200 p-4 rounded-lg shadow-lg text-black">
            <p>Are you sure you want to remove this artist from album?</p>
            <div className="mt-4 flex justify-end">
              {error && <div>{error}</div>}
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-md mr-2 hover:bg-red-600"
                onClick={confirmRemoveArtist}
              >
                Confirm
              </button>
              <button
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
                onClick={cancelRemoveArtist}
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

      {artistData && showAddForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-gray-200 p-4 rounded-lg shadow-lg text-black">
            <p>Select an artist to add:</p>
            <select value={selectedArtistId} onChange={handleArtistChange}>
              <option value="">Select artist</option> 
              {artistData.artists
                .filter(
                  (artist: any) =>
                    artist._id !== artistId &&
                    !artists.some((a: any) => a._id === artist._id)
                )
                .map((artist: any) => (
                  <option key={artist._id} value={artist._id}>
                    {artist.display_name}
                  </option>
                ))}
            </select>
            <div className="mt-4 flex justify-end">
              <button
                className="px-4 py-2 bg-green-500 text-white rounded-md mr-2 hover:bg-green-600"
                onClick={confirmAddArtist}
              >
                Add
              </button>
              <button
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
                onClick={cancelAddArtist}
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

export default AlbumDetailsArtists;
