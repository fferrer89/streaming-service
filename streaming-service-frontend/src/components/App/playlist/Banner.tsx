"use client";
import { gql, useMutation } from "@apollo/client";
import { useState } from "react";
import { CiHeart } from "react-icons/ci";
import { FcLike } from "react-icons/fc";
import React from "react";
import createApolloClient from "@/utils";
import queries from "../../../utils/queries";
import { EditPlaylistModal } from "./EditPlaylistModal";
import { useSelector } from "react-redux";
import { FloatingAddButton } from "./AddSong";
import { RootState } from "@/utils/redux/store";

interface BannerProp {
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
      display_name: string;
    };
    created_date: string;
    _id: string;
    title: string;
    isLiked: boolean;
    isOwner: boolean;
  };
}

export const PlayListBanner: React.FC<BannerProp> = ({ playlist }) => {
  const [likeToggle, setLikeToggle] = useState<boolean>(playlist.isLiked);
  const { token } = useSelector((state: RootState) => state.user);
  const apolloClient = createApolloClient(token);
  const [likePlayList, { data: toggleData, loading, error }] = useMutation(
    queries.TOGGLE_PLAYLIST,
    { refetchQueries: [queries.GET_PLAYLIST], client: apolloClient }
  );
  console.log("-----------------", playlist.isOwner);
  if (error) {
    console.log(error);
  }

  return (
    <div className="flex flex-col bg-gray-800 text-white p-5 rounded-lg shadow-lg">
      <div className="flex flex-row justify-between items-center">
        <h1 className="text-4xl font-bold">{playlist.title}</h1>
        {playlist.isOwner && <EditPlaylistModal data={playlist} />}
      </div>

      <p className="text-gray-400 mt-2">By {playlist.owner.display_name}</p>
      <p className="mt-4">{playlist.description}</p>
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center space-x-2 bg-[#A2825D] hover:bg-[#C6AC8E] focus:[#C6AC8E]  px-4 py-2 rounded-full">
          <span className="text-xl">{playlist.likes ? playlist.likes : 0}</span>
          <span>likes</span>
        </div>
        <button
          onClick={() => {
            setLikeToggle(!likeToggle);
            likePlayList({
              variables: { playlistId: playlist._id },
            });
          }}
          className="flex items-center justify-center p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
        >
          {!likeToggle ? <CiHeart size={"40px"} /> : <FcLike size={"40px"} />}
        </button>
      </div>
    </div>
  );
};
