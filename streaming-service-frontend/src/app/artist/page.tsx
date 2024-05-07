"use client";
import React, { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import Card from "@/components/App/Feed/Card";
import InfiniteCarousel from "@/components/App/Feed/InfiniteCarousel";
import { useDispatch } from "react-redux";
import { playSong, setNextSongs } from "@/utils/redux/features/song/songSlice";
import apolloClient from "@/utils";
import { FeedQuery } from "@/utils/graphql/queries";
import { FeedQueryResult } from "@/utils/graphql/resultTypes";
import { getImageUrl } from "@/utils/tools/images";

import { useQuery, useLazyQuery } from "@apollo/client";
import queries from "@/utils/queries";
// TODO: FIX INIFINITE CAROUSEL

const Home: React.FC = () => {
  const dispatch = useDispatch();
  const [mostLikedSongs, setMostLikedSongs] = useState<
    FeedQueryResult["getMostLikedSongs"]
  >([]);
  const [mostFollowedArtists, setMostFollowedArtists] = useState<
    FeedQueryResult["getMostFollowedArtists"]
  >([]);

  useEffect(() => {
    const fetchMostLikedSongsAndArtists = async () => {
      try {
        const { data } = await apolloClient.query({
          query: FeedQuery,
        });
        setMostLikedSongs(data.getMostLikedSongs.slice(0, 10));
        setMostFollowedArtists(data.getMostFollowedArtists);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchMostLikedSongsAndArtists();
  }, []);
  const [getNextSongs, { data: nextSongsData }] = useLazyQuery(
    queries.GET_NEXT_SONGS
  );

  useEffect(() => {
    if (nextSongsData && nextSongsData.getNextSongs) {
      dispatch(setNextSongs(nextSongsData.getNextSongs));
    }
  }, [nextSongsData]);

  const handleSongClick = (songId: string) => {
    getNextSongs({ variables: { clickedSongId: songId } });
    const clickedSong = mostLikedSongs.find((song) => song._id === songId);
    if (clickedSong) {
      dispatch(playSong({ song: clickedSong, currentTime: 0 }));
    }
  };

  return (
    <div
      className="w-full h-full bg-cover bg-center overflow-hidden"
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
      <div className="flex flex-col items-start justify-start h-full w-full overflow-y-scroll overflow-x-clip">
        <div className="flex flex-col items-center justify-center w-full h-auto">
          <div className="w-full flex">
            <h1 className="text-2xl italic text-center px-5 py-4 font-thin">
              SOUNDS FOR YOU
            </h1>
          </div>
          <Separator className="w-[97%]" />
          <InfiniteCarousel
            items={mostLikedSongs.map((song) => (
              <Card
                onClick={() => handleSongClick(song._id)}
                key={song._id}
                image={
                  song.album && song.album.cover_image_url
                    ? getImageUrl(song.album.cover_image_url)
                    : "/img/music_note.jpeg"
                }
                songId={song._id}
              />
            ))}
            speed={0.4}
            direction="left"
          />
        </div>
        <div className="flex flex-col items-center justify-center w-full h-auto">
          <div className="w-full flex">
            <h1 className="text-2xl italic text-center px-5 py-4 font-thin">
              ARTISTS OF THE WEEK
            </h1>
          </div>
          <Separator className="w-[97%]" />
          <InfiniteCarousel
            items={mostFollowedArtists.map((artist) => (
              <Card
                rounded="full"
                key={artist._id}
                image={getImageUrl(artist.profile_image_url)}
                songId={artist._id}
              />
            ))}
            speed={0.4}
            direction="right"
          />
        </div>
        <div className="flex flex-col items-center justify-center w-full h-auto">
          <div className="w-full flex">
            <h1 className="text-2xl italic text-center px-5 py-4 font-thin">
              ARTISTS OF THE WEEK
            </h1>
          </div>
          <Separator className="w-[97%]" />
          <InfiniteCarousel
            items={mostFollowedArtists.map((artist) => (
              <Card
                rounded="full"
                key={artist._id}
                image={getImageUrl(artist.profile_image_url)}
                songId={artist._id}
              />
            ))}
            speed={0.4}
            direction="left"
          />
        </div>
        <div className="flex flex-col items-center justify-center w-full h-auto">
          <div className="w-full flex">
            <h1 className="text-2xl italic text-center px-5 py-4 font-thin">
              ARTISTS OF THE WEEK
            </h1>
          </div>
          <Separator className="w-[97%]" />
          <InfiniteCarousel
            items={mostFollowedArtists.map((artist) => (
              <Card
                rounded="full"
                key={artist._id}
                image={getImageUrl(artist.profile_image_url)}
                songId={artist._id}
              />
            ))}
            speed={0.4}
            direction="right"
          />
        </div>
        <div className="flex flex-col items-center justify-center w-full h-auto">
          <div className="w-full flex">
            <h1 className="text-2xl italic text-center px-5 py-4 font-thin">
              ARTISTS OF THE WEEK
            </h1>
          </div>
          <Separator className="w-[97%]" />
          <InfiniteCarousel
            items={mostFollowedArtists.map((artist) => (
              <Card
                rounded="full"
                key={artist._id}
                image={getImageUrl(artist.profile_image_url)}
                songId={artist._id}
              />
            ))}
            speed={0.4}
            direction="left"
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
