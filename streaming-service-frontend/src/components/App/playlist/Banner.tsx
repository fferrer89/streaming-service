"use client";
import { gql, useMutation } from "@apollo/client";
import { useState } from "react";
import { CiHeart } from "react-icons/ci";
import { FcLike } from "react-icons/fc";
import React from "react";
import { client } from "../../../utils/playlistHelper";
import queries from "../../../utils/queries";
import { EditPlaylistModal } from "./EditPlaylistModal";
import { AddPlaylistModal } from "./AddPlaylistModal";
import { FloatingAddButton } from "./AddSong";

interface BannaerProp {
  playlist: {
    songs: {
      _id: string;
      title: string;
      album: {
        _id: string;
        title: string;
      };
      cover_image_url: string;
      duration: number;
    }[];
    likes: number;
    description: string;
    owner: {
      first_name: string;
    };
    created_date: string;
    _id: string;
    title: string;
    isLiked: boolean;
    isOwner: boolean;
  };
}

export const PlayListBanner: React.FC<BannaerProp> = ({ playlist }) => {
  const [likeToggle, setLikeToggle] = useState<boolean>(playlist.isLiked);

  const [likePlayList, { data: toggleData, loading, error }] = useMutation(
    queries.TOGGLE_PLAYLIST,
    { refetchQueries: [queries.GET_PLAYLIST], client }
  );

  if (error) {
    console.log(error);
  }

  return (
    <div
      className="flex flex-col"
      style={{
        height: "200px",
        justifyContent: "center",
        backgroundColor: "#a7a8a7",
      }}
    >
      <div className="flex flex-row justify-between">
        <p className="px-3" style={{ fontSize: "50px" }}>
          {playlist.title}
        </p>
        <div className="px-5 py-3">
          {playlist.isOwner && <EditPlaylistModal data={playlist} />}
        </div>
      </div>

      <p className="px-3 text-gray-500" style={{ marginBottom: "1rem" }}>
        By {playlist.owner.first_name}
      </p>
      <div className="flex flex-col">
        <p className="text-sm px-3">{playlist.description}</p>
        <div className="flex items-center justify-between px-3">
          <div
            className="flex text-white justify-center items-center px-2  rounded-md w-fit"
            style={{ backgroundColor: "#36630b" }}
          >
            <p className="text-md" style={{ marginRight: "0.4rem" }}>
              {playlist.likes}
            </p>
            <p>likes</p>
          </div>
          <div
            onClick={() => {
              setLikeToggle(!likeToggle);
              likePlayList({
                variables: { playlistId: playlist._id },
              });
            }}
          >
            {!likeToggle && <CiHeart size={"40px"} />}
            {likeToggle && <FcLike size={"40px"} />}
          </div>
        </div>
        <AddPlaylistModal />
      </div>
    </div>
  );
};
