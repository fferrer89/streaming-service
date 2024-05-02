'use client'
import React, { useState, useEffect } from "react";
import Artists from "@/components/App/Serach/Artists";
import Playlists from "@/components/App/Serach/Playlists";
import Songs from "@/components/App/Serach/Songs";
type ResultType = {
    artists: { name: string; link: string }[];
    playlists: { name: string; link: string }[];
    songs: any[]; // Replace 'any' with the actual type of 'songs' if it's known
  };
  
  const Search: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [results, setResults] = useState<ResultType>({artists: [], playlists: [], songs: []});

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm) {
     
        const mockSearch = async (term: string) => {
          return {
            artists: [{name: "Artist 1", link: "/artist/1"}, {name: "Artist 2", link: "/artist/2"}],
            playlists: [{name: "Playlist 1", link: "/playlist/1"}, {name: "Playlist 2", link: "/playlist/2"}],
            songs: []
          };
        };
        mockSearch(searchTerm).then(setResults);
      }
    }, 500);  
    return () => clearTimeout(timeoutId);  
  }, [searchTerm]);

  return (
    <div
      className="flex-col h-full p-5 gap-5  w-full rounded-lg  flex items-center relative self-stretch"
      style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
    >
      <div className="min-w-[500px] mx-auto">
        <div className="relative flex items-center w-full h-12 rounded-lg focus-within:shadow-lg bg-white opacity-75 overflow-hidden">
          <div className="grid place-items-center h-full w-12 text-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            className="peer h-full w-full outline-none text-sm text-gray-700 pr-2"
            type="text"
            id="search"
            placeholder="Search something.."
            value={searchTerm}
            onChange={handleSearch}
          /> 
        </div>
      </div>
      <Artists artists={results.artists} />
      <Playlists playlists={results.playlists} />
      <Songs songs={results.songs} />
    </div>
  );
};

export default Search;

