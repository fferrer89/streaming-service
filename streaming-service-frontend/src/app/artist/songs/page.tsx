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
  // @ts-ignore
  const [createSongFormState, createSongFormAction] = useFormState(createSong, initialState);
  if (loading) {
    return <div>Loading</div>;
  }
  // @ts-ignore
  return (
    <div
      className="flex-col h-full p-5 gap-5  w-full rounded-lg  flex items-center relative self-stretch"
      style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
    >

      {showSongModal && (
          <SongFormModal
              actionData={createSongFormState}
              action={createSongFormAction}
              artistSongs={artistSongs}
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
