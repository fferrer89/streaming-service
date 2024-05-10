//@ts-nocheck
import React, { useState, useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client";
import axios from "axios";
import queries from "@/utils/queries";
import { MusicGenres } from "@/utils/helpers";
import { useFormState } from "react-dom";
import { updateAlbum } from "@/app/actions.js";
import { useSelector } from "react-redux";

const initialState = {
  album: null,
  errorMessages: [],
};

const EditAlbumModal: React.FC<{
  setShowModal: (show: boolean) => void;
  setSuccessModalOpen: (show: boolean) => void;
  refetch: any;
  albumId: string;
}> = ({ setShowModal, setSuccessModalOpen, refetch, albumId }) => {
  const artistId = useSelector(
    (state: { user: { userId: string | null } }) => state.user.userId
  );
  const token = useSelector(
    (state: { user: { token: string | null } }) => state.user.token
  );

  const { data: albumData, loading: albumLoading, error: albumError } = useQuery(queries.GET_ALBUM_BY_ID, {
    variables: { albumId },
  });

  const [formData, setFormData] = useState({
    album_type: "",
    title: "",
    description: "",
    release_date: "",
    genres: [],
    visibility: "",
    coverImageUrl: "",
    artists: [],
    songs: [],
  });

  useEffect(() => {
    if (albumData) {
      setFormData({
        album_type: albumData.album_type,
        title: albumData.title,
        description: albumData.description,
        release_date: albumData.release_date,
        genres: albumData.genres,
        visibility: albumData.visibility,
        coverImageUrl: albumData.cover_image_url,
        artists: albumData.artists.map(artist => artist._id),
        songs: albumData.songs.map(song => song._id),
      });
    }
  }, [albumData]);

  const [coverImageFile, setCoverImageFile] = useState(null);
  const [error, setError] = useState("");

  const [updateAlbumFormState, updateAlbumFormAction] = useFormState(
    (state: any, payload: any) => updateAlbum(state, payload, token),
    initialState
  );

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "releaseDate") {
      const formattedDate = new Date(value).toISOString().split("T")[0];

      setFormData((prevData) => ({
        ...prevData,
        release_date: formattedDate,
      }));
    } else {
      setFormData((prevData) => ({
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

    setFormData((prevData) => ({
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
    try {
      formData.artists.push(artistId);
      updateAlbumFormAction({ ...formData, albumId });
    } catch (error) {
      console.error("Error updating album:", error);
      setError("Error updating album, server responded error");
      return;
    }
  };

  useEffect(() => {
    if (
      updateAlbumFormState &&
      updateAlbumFormState.album &&
      updateAlbumFormState.album._id
    ) {
      setShowModal(false);
      setSuccessModalOpen(true);
      refetch();
    }
  }, [updateAlbumFormState]);

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
      setFormData({ ...formData, coverImageUrl: id });
    } catch (error) {
      console.error("Error uploading file:", error);
      setError(error.message);
    }
  };

  if (albumLoading) {
    return <div>Loading Album Details</div>;
  }

  if (albumError) {
    return <div>Error Loading Album Details</div>;
  }

  return (
    <div className="fixed inset-0 z-10 overflow-y-auto flex items-center justify-center">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative bg-stone-400 rounded-lg shadow-md w-6/12 p-4 overflow-y-auto h-4/5">
       
      </div>
    </div>
  );
};

export default EditAlbumModal;

