// ArtistAlbum.tsx
"use client";
import React, { useEffect, useState } from "react";
import UserProfile from "@/components/App/Profile/UserProfile";
import { useQuery } from "@apollo/client";
import { useSelector } from "react-redux";
import { GET_USER_BY_ID } from "@/utils/graphql/queries"; // Ensure the correct path to your queries file

const ArtistAlbum: React.FC<{ params: { id: string } }> = ({ params }) => {
  const userId = useSelector((state: { user: { userId: string | null } }) => state.user.userId);
  const { data, loading, error } = useQuery(GET_USER_BY_ID, {
    variables: { id: userId },
    fetchPolicy: "no-cache"
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading data: {error.message}</div>;
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
      <div className="w-full h-full items-start overflow-y-scroll p-4 space-y-4 no-scrollbar">
        {data && <UserProfile userData={data} />}
      </div>
    </div>
  );
};

export default ArtistAlbum;
