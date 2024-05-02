"use client";
import React from "react";
import { useQuery } from "@apollo/client";
import queries from "@/utils/queries";
import SPlayer from "@/components/views/dashboard/footer-player";
import Search from "@/components/views/dashboard/search";
import TrendingSongs from "@/components/views/dashboard/trending-songs";
import TrendingAlbums from "@/components/views/dashboard/trending-albums";
import TrendingArtists from "@/components/views/dashboard/trending-artists";
import YourRecentSongs from "@/components/views/dashboard/your-recent-songs";
const UserDashboard: React.FC = () => {
  const { loading: artistsLoading, data: artistsData } = useQuery(
    queries.GET_ARTISTS
  );
  const { loading: albumsLoading, data: albumsData } = useQuery(
    queries.GET_ALBUMS
  );
  const { loading: songsLoading, data: songsData } = useQuery(
    queries.GET_SONGS
  );
  //   const { loading: playlistsLoading, data: playlistsData } = useQuery(
  //     queries.GET_PLAYLISTS_BY_OWNER
  //   );

  if (artistsLoading || albumsLoading || songsLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="fixed">
      <div className="flex min-h-screen items-center relative bg-black">
        <div className="flex flex-col w-[450px] gap-4 pl-4 pr-2 pt-8 pb-0 self-stretch items-center relative">
          <div className="flex flex-col h-[200px] gap-4 pl-0 pr-2 pt-4 pb-0 self-stretch w-full rounded-[20px] overflow-hidden bg-gradient-to-b from-stone-800 to-transparent items-center relative">
            <div className="flex h-[50px] justify-between pl-[20px] pr-2 py-0 self-stretch w-full items-center relative">
              <a href="/user/profile">
                <img
                  className="w-[50px] h-[50px] object-cover rounded-full"
                  alt="Ellipse"
                  src="/img/ellipse.png"
                />
              </a>
            </div>
            <div className="flex h-[50px] items-center gap-[20px] pl-[20px] pr-2 py-0 relative self-stretch w-full hover:bg-gray-300">
              <img
                className="w-[30px] h-[30px] object-cover"
                alt="Home icon"
                src="/icons/home-white.png"
              />
              <a
                href="/user/dashboard"
                className="[font-medium text-white text-[18px] tracking-[0] leading-[normal] bg-transparent border-none cursor-pointer hover:underline"
              >
                Home
              </a>
            </div>
            <div className="flex h-[50px] items-center gap-[20px] pl-[20px] pr-2 py-0 relative self-stretch w-full hover:bg-gray-300">
              <img
                className="w-[30px] h-[30px] object-cover"
                alt="Search results"
                src="/icons/search-white.png"
              />
              <a className="[font-medium text-white text-[18px] tracking-[0] leading-[normal] bg-transparent border-none cursor-pointer hover:underline">
                Search
              </a>
            </div>
          </div>
          <div className="flex-col h-[350px] gap-[20px] pl-0 pr-[10px] pt-[20px] pb-0 w-full rounded-[20px] overflow-hidden  bg-gradient-to-b from-stone-800 to-transparent items-center relative self-stretch">
            <div className="h-[50px] justify-between gap-4 pl-[20px] pr-2 py-[10px] w-full flex items-center relative self-stretch">
              <div className="inline-flex gap-[10px] mt-[1px] mb-[1px] items-center relative">
                <img
                  className="w-[20px] h-[20px] object-cover"
                  alt="Library icon"
                  src="/icons/library_icon.png"
                />
                <div className="[font-small text-white text-[20px] tracking-[0] leading-[normal]">
                  Your Sounds
                </div>
              </div>
            </div>
            <div className="flex flex-col w-[400px] h-[100px] gap-[20px] pl-0 pr-2 py-0 bg-[#fff9f94c] rounded-[20px] overflow-hidden items-center relative">
              <div className="flex h-[30px] pl-[20px] pr-2 py-[5px] self-stretch w-full items-center relative">
                <div className="inline-flex gap-[10px] items-center relative">
                  <div className="[font-medium text-white text-[18px] tracking-[0] leading-[normal]">
                    Playlists
                  </div>
                </div>
              </div>
            </div>
            {/* <div className="flex flex-col w-[400px] h-[100px] gap-[20px] pl-0 pr-2 py-0 bg-[#fff9f94c] rounded-[20px] overflow-hidden items-center relative">
              <div className="flex h-[30px] pl-[20px] pr-2 py-[5px] self-stretch w-full items-center relative">
                <div className="inline-flex gap-[10px] items-center relative">
                  <div className="[font-medium text-white text-[18px] tracking-[0] leading-[normal]">
                    Songs
                  </div>
                </div>
              </div>
            </div> */}
          </div>
        </div>
        <div className="flex flex-col gap-4 pl-4 pr-2 pt-8 pb-0 self-stretch items-center relative py-[15px] flex-1 grow ">
          <div className="flex-col h-[911px] w-[1200px] gap-[20px] pl-0 pr-[10px] pt-8 pb-0 w-full rounded-[20px] overflow-y-auto bg-gradient-to-b from-stone-800 to-transparent flex items-center relative self-stretch">
            <Search />
            <YourRecentSongs songsData={songsData} />
            <TrendingSongs songsData={songsData} />
            <TrendingAlbums albumsData={albumsData} />
            <TrendingArtists artistsData={artistsData} />
            <div className="w-[1150px] h-[791px] rounded-[20px] relative">
              <div className="flex h-[100px] pl-[22px] pr-0 py-[7px] self-stretch w-full items-center relative"></div>
            </div>
          </div>
        </div>
      </div>
      <SPlayer />
    </div>
  );
};

export default UserDashboard;
