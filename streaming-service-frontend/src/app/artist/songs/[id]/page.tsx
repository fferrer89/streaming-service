"use client";
import React, { useState, useEffect } from "react";
import SongDetails from "@/components/App/Artist/SongDetails";
import Playlists from "@/components/App/Serach/Playlists";
import Songs from "@/components/App/Serach/Songs";
import { useQuery } from "@apollo/client";
import queries from "@/utils/queries";
import {useSelector} from "react-redux";

const ArtistSong: React.FC<{ params: { id: string } }> = ({ params }) => {
  const {
    data: song,
    loading,
    error,
    refetch
  } = useQuery(queries.GET_SONG_BY_ID, {
    variables: { id: params.id },
  });
  if (loading) {
    return <div>Loading</div>;
  }
  return (
    <div
      className="flex-col h-full p-5 gap-5  w-full rounded-lg  flex items-center relative self-stretch"
      style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
    >
      <div className="w-full h-full items-start overflow-y-scroll p-4 space-y-4">
        <SongDetails
            songData={song}
            refetch={refetch}
        />
      </div>
    </div>
  );
};

export default ArtistSong;
