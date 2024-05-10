"use client";

import React, { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@apollo/client";
//import apolloClient from "@/utils";
import { GetUserLikedSongs } from "@/utils/graphql/queries";
import { UserLikedSong } from "@/utils/graphql/resultTypes";
import { RootState } from "@/utils/redux/store";
import { useSelector } from "react-redux";
import { getImageUrl } from "@/utils/tools/images";
import createApolloClient from "@/utils/";
import { playSong } from "@/utils/redux/features/song/songSlice";
import Link from "next/link";
import { useDispatch } from "react-redux";

const Songs: React.FC = () => {
  const dispatch = useDispatch();
  const [songs, setSongs] = useState<UserLikedSong[]>([]);
  const userId = useSelector((state: RootState) => state.user.userId);
  const userType = useSelector((state: RootState) => state.user.userType);
  const { token } = useSelector((state: RootState) => state.user);
  const apolloClient = createApolloClient(token);
  const { loading, error, data } = useQuery(GetUserLikedSongs, {
    variables: { userId },
    client: apolloClient,
  });

  useEffect(() => {
    if (!loading && !error && data) {
      setSongs(data.getUserLikedSongs);
    }
  }, [loading, error, data, userId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-lg font-semibold">
          Loading your favorite songs...
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col w-full h-auto gap-5 p-0 bg-white rounded-lg overflow-hidden items-center relative justify-start"
      style={{ backgroundColor: "rgba(255, 255, 255, 0.5)" }}
    >
      <div className="inline-flex gap-4 flex-auto items-start relative w-full px-5 pt-3 flex-col">
        <div className="relative w-auto mt-0 font-mono font-medium text-lg text-center tracking-normal leading-normal">
          Liked Songs
        </div>
        <Separator className="w-[95%] " />
      </div>

      <div className="w-full px-3 py- overflow-y-auto">
        {songs.length > 0 ? (
          songs.map((song, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-gray-100 rounded-lg p-3 mb-2 shadow hover:bg-gray-200 transition-colors"
              onClick={() => dispatch(playSong({ song, currentTime: 0 }))}
            >
              <img
                src={
                  song && song.album && song.album.cover_image_url
                    ? getImageUrl(song.album.cover_image_url)
                    : "/img/music_note.jpeg"
                }
                alt="Album cover"
                className="w-8 h-8 object-cover border border-black"
              />
              <span className="text-gray-800 text-sm font-semibold">
                {song.title}
              </span>
            </div>
          ))
        ) : (
          <div className="text-center  py-4">
            <p>You don&apost have any liked songs yet</p>
            <div className="inline-block rounded-full bg-gray-300 px-6 py-3 shadow border border-black">
              <Link
                href={
                  userType === "artist" ? "/artist/search" : "/sound/search"
                }
                className="text-black font-semibold"
              >
                Explore Songs
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Songs;
