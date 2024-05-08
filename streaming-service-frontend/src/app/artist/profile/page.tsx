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
      className="w-full h-full bg-cover bg-center overflow-x-hidden no-scrollbar"
      style={{
        backgroundImage: 'url("/img/app-background.png")',
        borderRadius: "1rem",
        border: "1px solid #ffffff",
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        backgroundBlendMode: "overlay",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="w-full h-full items-start overflow-y-scroll p-4 space-y-4">
        <ArtistProfile artistData={artist} />
      </div>
    </div>
  );
};

export default ArtistAlbum;
