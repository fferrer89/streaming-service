"use client";
import React, { useState, useEffect } from "react";
import ArtistProfile from "@/components/App/Artist/ArtistProfile";
import Playlists from "@/components/App/Serach/Playlists";
import Songs from "@/components/App/Serach/Songs";
import { useQuery } from "@apollo/client";
import queries from "@/utils/queries";
import { useSelector } from "react-redux";

type ResultType = {
  albums: { name: string; link: string }[];
};

const ArtistAlbum: React.FC<{ params: { id: string } }> = ({ params }) => {
  const artistId = useSelector(
    (state: { user: { userId: string | null } }) => state.user.userId
  );
  const {
    data: artist,
    loading,
    error,
  } = useQuery(queries.GET_ARTIST_BY_ID, {
    variables: { id: artistId },
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
        <ArtistProfile artistData={artist} />
      </div>
    </div>
  );
};

export default ArtistAlbum;
