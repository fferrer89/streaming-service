// Home.tsx
"use client";
import React, { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import Card from "@/components/App/Feed/Card";
import InfiniteCarousel from "@/components/App/Feed/InfiniteCarousel";
import { useDispatch } from "react-redux";
import { playSong, setNextSongs } from "@/utils/redux/features/song/songSlice";
import createApolloClient from "@/utils";
import { FeedQuery } from "@/utils/graphql/queries";
import { FeedQueryResult } from "@/utils/graphql/resultTypes";
import { getImageUrl } from "@/utils/tools/images";
import { useRouter } from "next/navigation";
import SkeletonLoader from "@/components/App/SkeletonLoader";
import { useSelector } from "react-redux";
import { RootState } from "@/utils/redux/store";
import { useLazyQuery } from "@apollo/client";
import queries from "@/utils/queries";
// TODO: FIX INFINITE CAROUSEL

const Home: React.FC = () => {
  const { token } = useSelector((state: RootState) => state.user);
  const apolloClient = createApolloClient(token);
  const dispatch = useDispatch();
  const { push } = useRouter();
  const [mostLikedSongs, setMostLikedSongs] = useState<
    FeedQueryResult["getMostLikedSongs"]
  >([]);
  const [mostFollowedArtists, setMostFollowedArtists] = useState<
    FeedQueryResult["getMostFollowedArtists"]
  >([]);
  const [newlyReleasedAlbums, setNewlyReleasedAlbums] = useState<
    FeedQueryResult["getNewlyReleasedAlbums"]
  >([]);
  const [mostLikedAlbums, setMostLikedAlbums] = useState<
    FeedQueryResult["getMostLikedAlbums"]
  >([]);
  const [newlyReleasedSongs, setNewlyReleasedSongs] = useState<
    FeedQueryResult["getNewlyReleasedSongs"]
  >([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMostLikedSongsAndArtists = async () => {
      try {
        const { data } = await apolloClient.query({
          query: FeedQuery,
        });
        setMostLikedSongs(data.getMostLikedSongs.slice(0, 10));
        setMostFollowedArtists(data.getMostFollowedArtists.slice(0, 10));
        setNewlyReleasedAlbums(data.getNewlyReleasedAlbums.slice(0, 10));
        setMostLikedAlbums(data.getMostLikedAlbums.slice(0, 10));
        setNewlyReleasedSongs(data.getNewlyReleasedSongs.slice(0, 10));
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
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
    const clickedSong = mostLikedSongs.find((song) => song._id === songId) || newlyReleasedSongs.find((song) => song._id === songId);;
    if (clickedSong) {
      dispatch(playSong({ song: clickedSong, currentTime: 0 }));
    }
  };

  const renderLoadingSkeleton = (count: number) => (
    <div className="flex gap-4 overflow-x-scroll py-3 no-scrollbar w-full">
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonLoader key={index} />
      ))}
    </div>
  );

  return (
    <div
      className="grid grid-cols-1 gap-4 bg-cover bg-center overflow-x-hidden h-full no-scrollbar"
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
      <div className="flex flex-col items-center justify-center w-full h-auto">
        <div className="w-full flex">
          <h1 className="text-2xl italic text-center px-5 py-4 font-thin">
            SOUNDS FOR YOU
          </h1>
        </div>
        <Separator className="w-[97%]" />
        {loading ? (
          renderLoadingSkeleton(10)
        ) : (
          <InfiniteCarousel
            items={mostLikedSongs.map((song) => (
              <Card
                onClick={() => handleSongClick(song._id)}
                key={song._id}
                image={getImageUrl(song.cover_image_url)}
                songId={song._id}
              />
            ))}
            speed={0.4}
            direction="left"
          />
        )}
      </div>
      <div className="flex flex-col items-center justify-center w-full h-auto">
        <div className="w-full flex">
          <h1 className="text-2xl italic text-center px-5 py-4 font-thin">
            ARTISTS OF THE WEEK
          </h1>
        </div>
        <Separator className="w-[97%]" />
        {loading ? (
          renderLoadingSkeleton(5)
        ) : (
          <InfiniteCarousel
            items={mostFollowedArtists.map((artist) => (
              <Card
                rounded="full"
                key={artist._id}
                image={getImageUrl(artist.profile_image_url)}
                songId={artist._id}
                onClick={() => push(`/sound/artistProfile/${artist._id}`)}
              />
            ))}
            speed={0.4}
            direction="right"
          />
        )}
      </div>
      <div className="flex flex-col items-center justify-center w-full h-auto">
        <div className="w-full flex">
          <h1 className="text-2xl italic text-center px-5 py-4 font-thin">
            ALBUMS OF THE WEEK
          </h1>
        </div>
        <Separator className="w-[97%]" />
        {loading ? (
          renderLoadingSkeleton(5)
        ) : (
          <InfiniteCarousel
            items={mostLikedAlbums.map((album) => (
              <Card
                rounded="full"
                key={album._id}
                image={getImageUrl(album.cover_image_url)}
                songId={album._id}
                onClick={() => push(`/sound/album/${album._id}`)}
              />
            ))}
            speed={0.4}
            direction="left"
          />
        )}
      </div>
      <div className="flex flex-col items-center justify-center w-full h-auto">
        <div className="w-full flex">
          <h1 className="text-2xl italic text-center px-5 py-4 font-thin">
            NEW ALBUMS
          </h1>
        </div>
        <Separator className="w-[97%]" />
        {loading ? (
          renderLoadingSkeleton(5)
        ) : (
          <InfiniteCarousel
            items={newlyReleasedAlbums.map((album) => (
              <Card
                rounded="full"
                key={album._id}
                image={getImageUrl(album.cover_image_url)}
                songId={album._id}
                onClick={() => push(`/sound/album/${album._id}`)}
              />
            ))}
            speed={0.4}
            direction="right"
          />
        )}
      </div>
      <div className="flex flex-col items-center justify-center w-full h-auto">
        <div className="w-full flex">
          <h1 className="text-2xl italic text-center px-5 py-4 font-thin">
            NEW SONGS
          </h1>
        </div>
        <Separator className="w-[97%]" />
        {loading ? (
          renderLoadingSkeleton(5)
        ) : (
          <InfiniteCarousel
            items={newlyReleasedSongs.map((song) => (
              <Card
              onClick={() => handleSongClick(song._id)}
                key={song._id}
                image={getImageUrl(song.cover_image_url)}
                songId={song._id}
              />
            ))}
            speed={0.4}
            direction="left"
          />
        )}
      </div>
    </div>
  );
};

export default Home;
