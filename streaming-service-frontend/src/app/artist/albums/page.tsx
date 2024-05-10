"use client";
import React, { useState, useEffect } from "react";
import Albums from "@/components/App/Artist/Albums";
import { useQuery, useMutation } from "@apollo/client";
import queries from "@/utils/queries";
import axios from "axios";
import CreateAlbumModal from "@/components/App/Artist/CreateAlbumModel";
import { useSelector } from "react-redux";
import SuccessModal from "@/components/App/Artist/SuccessModal";

type ResultType = {
  albums: { name: string; link: string }[];
};

const ArtistAlbums: React.FC = () => {
  const artistId = useSelector(
    (state: { user: { userId: string | null } }) => state.user.userId
  );
  const {
    data: artistAlbums,
    loading,
    error,
    refetch,
  } = useQuery(queries.GET_ALBUMS_BY_ARTIST, {
    variables: { artistId: artistId },
    fetchPolicy: 'cache-and-network'
  });
  const [showModal, setShowModal] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const handleSuccessModalClose = () => {
    setSuccessModalOpen(false);
    refetch();
  };

  useEffect(() => {
    refetch();
  }, []);

  if (loading) {
    return <div>Loading</div>;
  }
  return (
    <div
      className="flex-col h-full p-5 gap-5  w-full rounded-lg  flex items-center relative self-stretch"
      style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
    >
  
      {showModal && (
        <CreateAlbumModal
          setShowModal={setShowModal}
          setSuccessModalOpen={setSuccessModalOpen}
          refetch={refetch}
        />
      )}
      {successModalOpen && (
        <SuccessModal
          isSuccess={true}
          message={"Album Successfully Created"}
          onClose={handleSuccessModalClose}
        />
      )}

      <button
        onClick={() => setShowModal(true)}
        className="bg-stone-300 hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
      >
        Create New Album
      </button>
      <div className="w-full h-full items-start overflow-y-scroll p-4 space-y-4">
        <Albums albums={artistAlbums && artistAlbums.getAlbumsByArtist} />
      </div>
    </div>
  );
};

export default ArtistAlbums;
