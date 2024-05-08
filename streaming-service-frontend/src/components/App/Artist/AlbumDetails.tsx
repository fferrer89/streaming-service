import React, { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import { Separator } from "@/components/ui/separator";
import AlbumDetailsSongs from "./units/AlbumDetailsSongs";
import AlbumDetailsArtists from "./units/AlbumDetailsArtists";
import { useRouter } from "next/navigation";

const REMOVE_ALBUM_MUTATION = gql`
  mutation RemoveAlbum($id: ID!) {
    removeAlbum(_id: $id) {
      _id
      title
    }
  }
`;

const UPDATE_ALBUM_MUTATION = gql`
  mutation Mutation(
    $id: ID!
    $albumType: AlbumType
    $title: String
    $description: String
    $releaseDate: Date
    $genres: [MusicGenre!]
    $visibility: Visibility
  ) {
    editAlbum(
      _id: $id
      album_type: $albumType
      title: $title
      description: $description
      release_date: $releaseDate
      genres: $genres
      visibility: $visibility
    ) {
      _id
      album_type
      total_songs
      cover_image_url
      title
      description
      release_date
      created_date
      last_updated
      genres
      likes
      total_duration
      visibility
    }
  }
`;

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
  const router = useRouter();
  const date = new Date(release_date);
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({
    album_type,
    genres,
    visibility,
    title,
    description,
    release_date: date.toLocaleDateString("en-CA"),
  });
  const [removeAlbum, { loading: removing, error: removeError }] = useMutation(
    REMOVE_ALBUM_MUTATION
  );
  const [updateAlbum, { loading: updating, error: updateError }] = useMutation(
    UPDATE_ALBUM_MUTATION
  );

  const handleRemoveAlbum = () => {
    setShowConfirmation(true);
  };

  const cancelRemoveAlbum = () => {
    setShowConfirmation(false);
  };

  const confirmRemoveAlbum = async () => {
    try {
      const response = await removeAlbum({
        variables: { id: _id },
      });
      if (response.data.removeAlbum) {
        router.push("/artist/albums");
      }
    } catch (err) {
      console.error("Error removing album:", err);
    }
    setShowConfirmation(false);
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const saveChanges = async () => {
    try {
      const response = await updateAlbum({
        variables: {
          id: _id,
          ...editData,
          genres: editData.genres.split(",").map((genre) => genre.trim()),
          release_date: new Date(editData.release_date).toISOString(),
        },
      });

      if (response.data.editAlbum) {
        // console.log("Album updated successfully:", response.data.editAlbum.title);
        refetch();
        toggleEditMode();
      }
    } catch (err) {
      console.error("Error updating album:", err);
    }
  };

  const formattedDate = date.toLocaleString("en-US", options);
  const imageUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/file/download/${cover_image_url}`;

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
          onClick={handleRemoveAlbum}
          className="bg-stone-300 hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow ml-8"
        >
          Delete This Album
        </button>
        <button
          onClick={toggleEditMode}
          className="bg-blue-300 hover:bg-blue-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow ml-2"
        >
          {editMode ? "Cancel Edit" : "Edit Album"}
        </button>
      </div>

      <Separator className="w-[95%]" />

      {showConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-gray-200 p-4 rounded-lg shadow-lg text-black">
            <p>Are you sure you want to remove this Album?</p>
            <div className="mt-4 flex justify-end">
              {removeError && (
                <div className="text-red-500">{removeError.message}</div>
              )}
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-md mr-2 hover:bg-red-600"
                onClick={confirmRemoveAlbum}
                disabled={removing}
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

      {editMode ? (
        <div className="w-full py-5 px-3 overflow-x-auto flex flex-row items-start text-dark">
          <div className="ml-4 flex flex-col justify-start">
            <div className="p-4 text-dark">
              <label
                htmlFor="title"
                className="block text-gray-700 font-semibold mb-2"
              >
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={editData.title}
                onChange={handleEditChange}
                className="border border-gray-300 rounded-md p-2 w-full mb-2 text-black"
              />

              <label
                htmlFor="description"
                className="block text-gray-700 font-semibold mb-2"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={editData.description}
                onChange={handleEditChange}
                rows="4"
                className="border border-gray-300 rounded-md p-2 w-full mb-2 text-black"
              />

              <label
                htmlFor="album_type"
                className="block text-gray-700 font-semibold mb-2"
              >
                Album Type
              </label>
              <input
                type="text"
                id="album_type"
                name="album_type"
                value={editData.album_type}
                onChange={handleEditChange}
                className="border border-gray-300 rounded-md p-2 w-full mb-2 text-black"
              />

              <label
                htmlFor="release_date"
                className="block text-gray-700 font-semibold mb-2"
              >
                Release Date
              </label>
              <input
                type="date"
                id="release_date"
                name="release_date"
                value={editData.release_date}
                onChange={handleEditChange}
                className="border border-gray-300 rounded-md p-2 w-full mb-2 text-black"
              />

              <label
                htmlFor="visibility"
                className="block text-gray-700 font-semibold mb-2"
              >
                Visibility
              </label>
              <input
                type="text"
                id="visibility"
                name="visibility"
                value={editData.visibility}
                onChange={handleEditChange}
                className="border border-gray-300 rounded-md p-2 w-full mb-2 text-black"
              />

              <label
                htmlFor="genres"
                className="block text-gray-700 font-semibold mb-2"
              >
                Genres
              </label>
              <input
                type="text"
                id="genres"
                name="genres"
                value={editData.genres}
                onChange={handleEditChange}
                className="border border-gray-300 rounded-md p-2 w-full mb-2 text-black"
              />

              <button
                onClick={saveChanges}
                disabled={updating}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              >
                Save Changes
              </button>
            </div>
          </div>
          <div className="ml-20 flex flex-col justify-start">
            <img className="w-full max-w-md" src={imageUrl} alt={title} />
          </div>
        </div>
      ) : (
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
      )}
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
