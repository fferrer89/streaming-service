import React, { useState, useEffect } from "react";
import { Separator } from "@/components/ui/separator";
import AlbumDetailsSongs from "./units/AlbumDetailsSongs";
import AlbumDetailsArtists from "./units/AlbumDetailsArtists";
const AlbumDetails: React.FC<{ albumData: any; refetch: any }> = ({
  albumData,
  refetch,
}) => {
  const {
    _id,
    album_type,
    artists,
    cover_image_url,
    description,
    genres,
    release_date,
    songs,
    title,
    total_duration,
    likes,
    total_songs,
    visibility,
  } = albumData.getAlbumById;
  const date = new Date(release_date);
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  const [showConfirmation, setShowConfirmation] = useState(false);
  const handleRemoveAlbum = () => {
    setShowConfirmation(true);
  };
  const cancelRemoveAlbum = () => {
    setShowConfirmation(false);
  };

  const confirmRemoveAlbum = async () => {
    // try {
    //   const response = await removeSongFromAlbum({
    //     variables: { id: albumId, songId: songToRemove },
    //   });
    //   if (response.errors && response.errors.length > 0) {
    //     setError(`Error removing song`);
    //     console.error("Error removing song:", error);
    //   } else {
    //     console.log("Song removed successfully");
    //     setSongToRemove("");
    //     setShowConfirmation(false);
    //   }
    //   refetch();
    // } catch (error) {
    //   console.error("Error removing song:", error);
    //   setSongToRemove("");
    //   setShowConfirmation(false);
    //   setM("Song Removed successfully");
    //   setIsSuccess(false);
    //   setShowSuccess(true);
    // }
  };

  const formattedDate = date.toLocaleString("en-US", options);
  const imageUrl = `http://localhost:4000/file/download/${cover_image_url}`;
  return (
    <div
      className="flex flex-col w-full h-fit gap-3 p-0 bg-white rounded-lg overflow-hidden relative"
      style={{ backgroundColor: "rgba(255, 255, 255, 0.5)" }}
    >
      <div className="inline-flex flex-auto items-center relative w-full px-5 pt-3">
        <div className="relative w-auto mt-0 font-mono font-medium text-white text-lg text-center tracking-normal">
          Album Details
        </div>
        <button
          onClick={() => setShowConfirmation(true)}
          className="bg-stone-300 hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow ml-8"
        >
          Delete This Album
        </button>
      </div>

      <Separator className="w-[95%]" />

      {showConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-gray-200 p-4 rounded-lg shadow-lg text-black">
            <p>Are you sure you want to remove this Album?</p>
            <div className="mt-4 flex justify-end">
              {/* {error && <div>{error}</div>} */}
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-md mr-2 hover:bg-red-600"
                onClick={confirmRemoveAlbum}
              >
                Confirm
              </button>
              <button
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
                onClick={cancelRemoveAlbum}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="w-full py-5 px-3 overflow-x-auto flex flex-row items-start">
        <div className="ml-4 flex flex-col justify-start">
          <div className="p-4">
            <h2 className="text-xl font-bold mb-2">{title}</h2>
            <p className="text-sm text-gray-600 mb-2">{description}</p>
            <p className="text-sm text-gray-600 mb-2">
              Album Type: {album_type}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              Release Date: {formattedDate}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              Visibility: {visibility}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              Genres: {genres.join(", ")}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              Total Songs: {total_songs}
            </p>
            <p className="text-sm text-gray-600 mb-2">Total Likes: {likes}</p>
          </div>
        </div>

        <div className="ml-20 flex flex-col justify-start">
          <img className="w-full max-w-md" src={imageUrl} alt={title} />
        </div>
      </div>
      <div className="flex flex-row gap-8 ml-8">
        <AlbumDetailsSongs songs={songs} refetch={refetch} albumId={_id} />
        <AlbumDetailsArtists
          artists={artists}
          refetch={refetch}
          albumId={_id}
        />
      </div>
    </div>
  );
};

export default AlbumDetails;
