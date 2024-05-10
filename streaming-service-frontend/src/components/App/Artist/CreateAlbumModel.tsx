//@ts-nocheck
import React, { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import axios from "axios";
import queries from "@/utils/queries";
import { MusicGenres } from "@/utils/helpers";
import { useFormState } from "react-dom";
import { createAlbum, updateAlbum } from "@/app/actions.js";
import { useQuery } from "@apollo/client";
import { useSelector } from "react-redux";

const initialState = {
  messages: [],
  errorMessages: [],
};

const CreateAlbumModal: React.FC<{
  setShowModal: (show: boolean) => void;
  setSuccessModalOpen: (show: boolean) => void;
  refetch: any;
}> = ({ setShowModal, setSuccessModalOpen, refetch }) => {
  const artistId = useSelector(
    (state: { user: { userId: string | null } }) => state.user.userId
  );
  const token = useSelector(
    (state: { user: { token: string | null } }) => state.user.token
  );
  const [albumData, setAlbumData] = useState({
    album_type: "ALBUM",
    title: "",
    description: "",
    release_date: "",
    genres: [],
    visibility: "PUBLIC",
    coverImageUrl: "",
    artists: [artistId],
    songs: [],
  });
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [error, setError] = useState("");
  const {
    loading: songsloading,
    error: songsError,
    data: songsData,
  } = useQuery(queries.GET_SONGS_BY_ARTIST, {
    variables: { artistId: artistId },
  });

  const {
    loading: artistsLoading,
    error: artistsError,
    data: artistsData,
  } = useQuery(queries.GET_ARTISTS);
  // @ts-ignore
  const [createAlbumFormState, createAlbumFormAction] = useFormState(
    (state: any, payload: any) => createAlbum(state, payload, token),
    initialState
  );

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "releaseDate") {
      const formattedDate = new Date(value).toISOString().split("T")[0];

      setAlbumData((prevData) => ({
        ...prevData,
        release_date: formattedDate,
      }));
    } else {
      setAlbumData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleGenreChange = (e: any) => {
    const { name, options } = e.target;
    const selectedGenres = Array.from(options)
      .filter((option: any) => option.selected)
      .map((option: any) => option.value);

    setAlbumData((prevData) => ({
      ...prevData,
      [name]: selectedGenres,
    }));
  };

  const handleFileChange = async (e: any) => {
    const file = e.target.files[0];
    setCoverImageFile(file);
    await uploadFile(file);
  };

  const handleSubmit = async () => {
    if (Object.values(albumData).every(value => value !== null && value !== '')) {
      try {
        albumData.artists.push(artistId);
        // @ts-ignore
        createAlbumFormAction(albumData);
      } catch (error) {
        console.error("Error creating new album:", error);
        setError("Error creating new album, server responded error");
        return;
      }
    } else {
      setError("Please fill all the fields before submitting.");
    }
  };

  useEffect(() => {
    if (
      createAlbumFormState &&
      createAlbumFormState.album &&
      createAlbumFormState.album._id
    ) {
      setShowModal(false);
      setSuccessModalOpen(true);
      refetch();
    }
  }, [createAlbumFormState]);
  // @ts-ignore
  const uploadFile = async (file: any) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/file/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const id = response.data.fileId;
      // console.log(`File Successfully Uploaded ${id}`);
      setAlbumData({ ...albumData, coverImageUrl: id });
    } catch (error) {
      console.error("Error uploading file:", error);
      setError(error.message);
    }
  };

  const handleSongChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedSongIds = Array.from(e.target.options)
      .filter((option) => option.selected)
      .map((option) => option.value);

    setAlbumData((prevData) => ({
      ...prevData,
      [e.target.name]: selectedSongIds,
    }));
  };

  if (artistsLoading || songsloading) {
    return <div>Loading Songs</div>;
  }

  if (songsError) {
    return <div>Error Loading Songs List</div>;
  }
  if (songsError) {
    return <div>Error Loading Artist List</div>;
  }
  // console.log(artistsData);
  if(songsData && songsData.getSongsByArtistID && songsData.getSongsByArtistID.length === 0){
    return (<div className="fixed inset-0 z-10 overflow-y-auto flex items-center justify-center">
    <div className="absolute inset-0 bg-black opacity-50"></div>
    <div className="relative bg-stone-400 rounded-lg shadow-md w-6/12 p-4 overflow-y-auto h-4/5">
      <div className="p-1 text-black overflow-y-auto h-6/12">
        <div className="mb-4">
          <h2 className="text-2xl font-semibold mb-4">No Songs Available</h2>
          <p>You need to have songs without albums to create a new album.</p>
        </div>
        <button
          onClick={() => setShowModal(false)}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none mr-2"
        >
          Close
        </button>
      </div>
    </div>
  </div>);
  }
  return (
    <div className="fixed inset-0 z-10 overflow-y-auto flex items-center justify-center">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative bg-stone-400 rounded-lg shadow-md w-6/12 p-4 overflow-y-auto h-4/5">
        <div>
          <h2 className="text-2xl font-semibold mb-4">New Album Details</h2>
        </div>

        <div className="p-1 text-black overflow-y-auto h-6/12">
          <div className="mb-4">
            <label
              htmlFor="album_type"
              className="block text-gray-700 font-semibold mb-2"
            >
              Album Type
            </label>
            <select
              id="album_type"
              name="album_type"
              value={albumData.album_type}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-md p-2 w-full"
              required
            >
              <option value="ALBUM">ALBUM</option>
              <option value="SINGLE">SINGLE</option>
              <option value="COMPILATION">COMPILATION</option>
              <option value="APPEARS_ON">APPEARS ON</option>
            </select>
          </div>

          <div className="mb-4">
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
              value={albumData.title}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-md p-2 w-full"
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-gray-700 font-semibold mb-2"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={albumData.description}
              onChange={handleInputChange}
              rows="4"
              className="border border-gray-300 rounded-md p-2 w-full"
              required
            ></textarea>
          </div>
          <div className="mb-4">
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
              value={albumData.release_date}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-md p-2 w-full"
              max={
                new Date(
                  new Date().getTime() - new Date().getTimezoneOffset() * 60000
                )
                  .toISOString()
                  .split("T")[0]
              }
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="genres"
              className="block text-gray-700 font-semibold mb-2"
            >
              Genres
            </label>
            <select
              id="genres"
              name="genres"
              value={albumData.genres}
              onChange={handleGenreChange}
              className="border border-gray-300 rounded-md p-2 w-full"
              multiple
              required
            >
              {MusicGenres.map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label
              htmlFor="visibility"
              className="block text-gray-700 font-semibold mb-2"
            >
              Visibility
            </label>
            <select
              id="visibility"
              name="visibility"
              value={albumData.visibility}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-md p-2 w-full"
              required
            >
              <option value="PUBLIC">PUBLIC</option>
              <option value="PRIVATE">PRIVATE</option>
            </select>
          </div>
          <div className="mb-4">
            <label
              htmlFor="coverImageUrl"
              className="block text-gray-700 font-semibold mb-2"
            >
              Cover Image Upload
            </label>
            <input
              type="file"
              id="coverImageUrl"
              name="coverImageUrl"
              onChange={handleFileChange}
              className="border border-gray-300 rounded-md p-2 w-full"
              accept="image/*"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="songs"
              className="block text-gray-700 font-semibold mb-2"
            >
              Songs
            </label>
            <select
              id="songs"
              name="songs"
              value={albumData.songs}
              onChange={handleSongChange}
              className="border border-gray-300 rounded-md p-2 w-full"
              multiple
              required
            >
              {songsData && songsData.getSongsByArtistID
                .filter((song) => song.album === null)
                .map((song) => (
                  <option key={song._id} value={song._id}>
                    {song.title}
                  </option>
                ))}
            </select>
          </div>
          <div className="mb-4">
            <label
              htmlFor="artists"
              className="block text-gray-700 font-semibold mb-2"
            >
              Artists
            </label>
            <select
              id="artists"
              name="artists"
              value={albumData.artists}
              onChange={handleSongChange}
              className="border border-gray-300 rounded-md p-2 w-full"
              multiple
              required
            >
              {artistsData.artists
                .filter((artist) => artist._id !== artistId)
                .map((artist) => (
                  <option key={artist._id} value={artist._id}>
                    {artist.display_name}
                  </option>
                ))}
            </select>
          </div>
          {createAlbumFormState && createAlbumFormState?.errorMessages && createAlbumFormState.length>0 && (
            <div
              className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4"
              role="alert"
            >
              {createAlbumFormState?.errorMessages?.map((msg, index) => {
                return (
                  <p className="error" key={index}>
                    {msg}
                  </p>
                );
              })}
            </div>
          )}
          {error && (
            <div
              className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4"
              role="alert"
            >
              {" "}
              <div className="error">{error}</div>
            </div>
          )}
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none mr-2"
          >
            Submit
          </button>
          <button
            onClick={() => setShowModal(false)}
            className="text-gray-600 hover:text-gray-800 focus:outline-none"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateAlbumModal;

