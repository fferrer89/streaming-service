"use client";
import React, { useState, useEffect } from "react";
import AlbumDetails from "@/components/App/Artist/AlbumDetails";
import Playlists from "@/components/App/Serach/Playlists";
import Songs from "@/components/App/Serach/Songs";
import { useQuery } from "@apollo/client";
import queries from "@/utils/queries";
type ResultType = {
  albums: { name: string; link: string }[];
};

const ArtistAlbum: React.FC<{ params: any }> = ({ params }) => {
  const {
    data: album,
    loading,
    error,
    refetch,
  } = useQuery(queries.GET_ALBUM_BY_ID, {
    variables: { id: params?.id },
    fetchPolicy: "cache-and-network",
    
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
        <AlbumDetails albumData={album} refetch={refetch} />
      </div>
    </div>
  );
};

export default ArtistAlbum;
