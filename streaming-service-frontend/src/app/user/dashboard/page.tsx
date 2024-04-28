"use client";
import React from "react";
import { useQuery } from "@apollo/client";
import queries from "@/graphql/queries.js";

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
    <div className="flex min-h-screen items-center relative bg-black">
      <div className="flex flex-col w-[549px] gap-[10px] pl-[17px] pr-[10px] pt-[25px] pb-0 self-stretch items-center relative">
        <div className="flex flex-col h-[273px] gap-[20px] pl-0 pr-[10px] pt-[20px] pb-0 self-stretch w-full rounded-[20px] overflow-hidden [background:linear-gradient(180deg,rgba(255,249.36,249.36,0.2)_0%,rgba(255,255,255,0)_100%)] items-center relative">
          <div className="flex h-[63px] justify-between pl-[22px] pr-0 py-0 self-stretch w-full items-center relative">
            <a href="/user/profile">
              <img
                className="relative w-[66px] h-[66px] mt-[-1.50px] mb-[-1.50px] ml-[-3.00px] object-cover"
                alt="Ellipse"
                src="/img/ellipse.png"
              />
            </a>
            <div className="flex w-[323px] justify-center gap-[7px] p-[10px] self-stretch bg-[#ffffff52] rounded-[20000px] overflow-hidden items-center relative">
              <img
                className="relative w-[45px] h-[45px] mt-[-1.00px] mb-[-1.00px] object-cover"
                alt="Rectangle"
                src="rectangle-1.png"
              />
              <div className="inline-flex gap-[4px] flex-[0_0_auto] items-center relative">
                <div className="w-[79px] h-[34px] mt-[-1.00px] [font-family:'JetBrains_Mono-Medium',Helvetica] font-medium text-[24px] relative text-white text-center tracking-[0] leading-[normal]">
                  2:34
                </div>
                <div className="flex w-[117px] h-[30px] justify-center gap-[15px] rounded-[50px] items-center relative">
                  <img
                    className="relative w-[20px] h-[20px] object-cover"
                    alt="Next button"
                    src="next-button-2.png"
                  />
                  <img
                    className="relative w-[20px] h-[20px] object-cover"
                    alt="Play button"
                    src="play-button-arrowhead-1.png"
                  />
                  <img
                    className="relative w-[20px] h-[20px] object-cover"
                    alt="Next button"
                    src="next-button-3.png"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex h-[63px] items-center gap-[38px] pl-[22px] pr-0 py-0 relative self-stretch w-full hover:bg-slate-600">
            <img
              className="relative w-[40px] h-[40px] object-cover"
              alt="Home icon"
              src="/img/home_icon_1.png"
            />
            <a
              href="/user/dashboard"
              className="relative w-fit [font-family:'JetBrains_Mono-Medium',Helvetica] font-medium text-white text-[30px] text-center tracking-[0] leading-[normal] bg-transparent border-none cursor-pointer "
            >
              Home
            </a>
          </div>
          <div className="flex h-[63px] items-center gap-[38px] pl-[22px] pr-0 py-0 relative self-stretch w-full hover:bg-slate-600">
            <img
              className="relative w-[40px] h-[40px] object-cover"
              alt="Search results"
              src="/img/search_icon.png"
            />
            <a className="relative w-fit [font-family:'JetBrains_Mono-Medium',Helvetica] font-medium text-white text-[30px] text-center tracking-[0] leading-[normal] bg-transparent border-none cursor-pointer ">
              Search
            </a>
          </div>
        </div>
        <div className="flex-col h-[642px] gap-[20px] pl-0 pr-[10px] pt-[20px] pb-0 w-full rounded-[20px] overflow-hidden [background:linear-gradient(180deg,rgba(255,249.36,249.36,0.2)_0%,rgba(255,255,255,0)_100%)] flex items-center relative self-stretch">
          <div className="h-[63px] justify-between pl-[22px] pr-0 py-[7px] w-full flex items-center relative self-stretch">
            <div className="inline-flex gap-[15px] flex-[0_0_auto] mt-[-0.50px] mb-[-0.50px] items-center relative">
              <img
                className="relative w-[50px] h-[50px] object-cover"
                alt="Library icon"
                src="/img/library_icon.png"
              />
              <div className="relative w-fit [font-family:'JetBrains_Mono-Medium',Helvetica] font-medium text-white text-[30px] text-center tracking-[0] leading-[normal]">
                Your Sounds
              </div>
            </div>
            <div className="flex flex-col w-[45px] h-[45px] justify-center gap-[10px] bg-[#ffffff66] rounded-[10000px] items-center relative">
              <div className="w-[33px] h-[49px] mt-[-3.00px] mb-[-1.00px] [font-family:'JetBrains_Mono-Thin',Helvetica] font-thin text-[55px] whitespace-nowrap relative text-white text-center tracking-[0] leading-[normal]">
                +
              </div>
            </div>
          </div>
          <div className="flex flex-col w-[477px] h-[187px] gap-[20px] pl-0 pr-[10px] py-0 bg-[#fff9f94c] rounded-[20px] overflow-hidden items-center relative">
            <div className="flex h-[63px] pl-[22px] pr-0 py-[7px] self-stretch w-full items-center relative">
              <div className="inline-flex gap-[15px] flex-[0_0_auto] items-center relative">
                <div className="relative w-fit mt-[-1.00px] [font-family:'JetBrains_Mono-Medium',Helvetica] font-medium text-white text-[25px] text-center tracking-[0] leading-[normal]">
                  Playlists
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col w-[477px] h-[190px] gap-[20px] pl-0 pr-[10px] py-0 bg-[#fff9f94c] rounded-[20px] overflow-hidden items-center relative">
            <div className="flex h-[63px] pl-[22px] pr-0 py-[7px] self-stretch w-full items-center relative">
              <div className="inline-flex gap-[15px] flex-[0_0_auto] items-center relative">
                <div className="relative w-fit mt-[-1.00px] [font-family:'JetBrains_Mono-Medium',Helvetica] font-medium text-white text-[25px] text-center tracking-[0] leading-[normal]">
                  Songs
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-col gap-[5px] pl-[10px] pr-[25px] py-[25px] flex-1 grow flex items-center relative self-stretch">
        <div className="flex-col h-[911px] gap-[20px] pl-0 pr-[10px] pt-[20px] pb-0 w-full rounded-[20px] overflow-hidden [background:linear-gradient(180deg,rgba(255,249.36,249.36,0.2)_0%,rgba(255,255,255,0)_100%)] flex items-center relative self-stretch">
          <div className="inline-flex flex-col h-[56px] gap-[10px] items-center relative">
            <div className="flex flex-col w-[477px] h-[56px] items-center justify-center gap-[20px] pl-0 pr-[10px] py-0 rounded-[100px] overflow-hidden border-2 border-solid border-white relative bg-[#fff9f933]">
              <div className="relative w-fit [font-family:'JetBrains_Mono-Light',Helvetica] font-light text-[#ffffffb2] text-[20px] text-center tracking-[0] leading-[normal]">
                Search
              </div>
              <img
                className="absolute w-[30px] h-[30px] top-[12px] left-[22px] object-cover"
                alt="Search results"
                src="/img/search_icon.png"
              />
            </div>
          </div>
          <div className="w-[1050px] h-[791px] rounded-[20px] relative bg-[#fff9f933]">
            <div className="flex h-[63px] pl-[22px] pr-0 py-[7px] self-stretch w-full items-center relative">
              <div className="inline-flex gap-[15px] flex-[0_0_auto] items-center relative">
                <div className="relative w-fit mt-[-1.00px] [font-family:'JetBrains_Mono-Medium',Helvetica] font-medium text-white text-[25px] text-center tracking-[0] leading-[normal]">
                  Your Recent Songs
                </div>
              </div>
            </div>
          </div>
          <div className="w-[1050px] h-[791px] rounded-[20px] relative bg-[#fff9f933]">
            <div className="flex h-[63px] pl-[22px] pr-0 py-[7px] self-stretch w-full items-center relative">
              <div className="inline-flex gap-[15px] flex-[0_0_auto] items-center relative">
                <div className="relative w-fit mt-[-1.00px] [font-family:'JetBrains_Mono-Medium',Helvetica] font-medium text-white text-[25px] text-center tracking-[0] leading-[normal]">
                  Trending Songs
                </div>
              </div>
            </div>
            <div className="overflow-x-auto mt-8">
              <div className="flex flex-nowrap justify-start px-4">
                {songsData.songs.map((song) => (
                  <a
                    href="/song/"
                    className="flex-shrink-0 w-[200px] m-4 rounded p-4 shadow-lg transition-all duration-700 hover:scale-110"
                  >
                    <div className="relative">
                      <img
                        src="/img/music_note.jpeg"
                        alt={song.title}
                        className="w-full rounded-[10px]"
                      />
                    </div>
                    <div className="mt-2 text-center text-[#1e1e1e] font-semibold">
                      {song.title}
                    </div>
                    <div className="mt-1 text-center text-[#7b7b7b] text-sm">
                      {song.artists
                        .map((artist) => artist.display_name)
                        .join(", ")}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="w-[1050px] h-[791px] rounded-[20px] relative bg-[#fff9f933]">
            <div className="flex h-[63px] pl-[22px] pr-0 py-[7px] self-stretch w-full items-center relative">
              <div className="inline-flex gap-[15px] flex-[0_0_auto] items-center relative">
                <div className="relative w-fit mt-[-1.00px] [font-family:'JetBrains_Mono-Medium',Helvetica] font-medium text-white text-[25px] text-center tracking-[0] leading-[normal]">
                  Trending Albums
                </div>
              </div>
            </div>
          </div>
          <div className="w-[1050px] h-[791px] rounded-[20px] relative bg-[#fff9f933]">
            <div className="flex h-[63px] pl-[22px] pr-0 py-[7px] self-stretch w-full items-center relative">
              <div className="inline-flex gap-[15px] flex-[0_0_auto] items-center relative">
                <div className="relative w-fit mt-[-1.00px] [font-family:'JetBrains_Mono-Medium',Helvetica] font-medium text-white text-[25px] text-center tracking-[0] leading-[normal]">
                  Trending Artist
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
