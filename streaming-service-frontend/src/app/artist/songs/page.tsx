"use client";
import React, { useState, useEffect } from "react";
import Albums from "@/components/App/Artist/Albums";
import Playlists from "@/components/App/Serach/Playlists";
import Songs from "@/components/App/Artist/Songs";
import { useQuery } from "@apollo/client";
import queries from "@/utils/queries";
import { useSelector } from "react-redux";
import SongFormModal from "@/components/App/Artist/SongFormModal";
import {useFormState} from "react-dom";
import {createSong} from "@/app/actions";
const initialState = {
  message: null
};
const ArtistSongs: React.FC = () => {
  const artistId = useSelector(
    (state: { user: { userId: string | null } }) => state.user.userId
  );
  const {
    data: artistSongs,
    loading,
    error,
    refetch
  } = useQuery(queries.GET_SONGS_BY_ARTIST, {
    variables: { artistId: artistId },
  });
  const [showSongModal, setShowSongModal] = useState(false);
  const [createSongFormState, createSongFormAction] = useFormState(createSong, initialState);
  if (loading) {
    return <div>Loading</div>;
  }
  return (
    <div
      className="flex-col h-full p-5 gap-5  w-full rounded-lg  flex items-center relative self-stretch"
      style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
    >
      <div className="min-w-[500px] mx-auto">
        <div className="relative flex items-center w-full h-12 rounded-lg focus-within:shadow-lg bg-white opacity-75 overflow-hidden">
          <div className="grid place-items-center h-full w-12 text-gray-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </div>
      {showSongModal && (
          <SongFormModal
              actionData={createSongFormState}
              action={createSongFormAction}
              albumData={artistSongs} // Fixme
              setShowModal={setShowSongModal}
              artistId={artistId}
              refetch={refetch}
          />
      )}
      <button
          onClick={() => setShowSongModal(true)}
          className="bg-stone-300 hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
      >
        Create New Song
      </button>
      <div className="w-full h-full items-start overflow-y-scroll p-4 space-y-4">
        <Songs songs={artistSongs?.getSongsByArtistID} />
      </div>
    </div>
  );
};

export default ArtistSongs;
