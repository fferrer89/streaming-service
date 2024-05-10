"use client";
// @ts-nocheck
import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { gql } from "@apollo/client";
import Artists from "@/components/App/Serach/Artists";
import Playlists from "@/components/App/Serach/Playlists";
import Songs from "@/components/App/Serach/Songs";
import createApolloClient from "@/utils";
import Albums from "@/components/App/Serach/Albums";
import { useSelector } from "react-redux";
import { RootState } from "@/utils/redux/store";

const SEARCH_QUERIES = gql`
  query SearchQueries($searchTerm: String!) {
    getPlaylistsByTitle(searchTerm: $searchTerm) {
      _id
      title
      description
      visibility
      owner {
        _id
        display_name
        profile_image_url
      }
    }
    getSongsByTitle(searchTerm: $searchTerm) {
      _id
      title
      duration
      song_url
      writtenBy
      producers
      language
      genre
      lyrics
      likes
      release_date
      album {
        _id
        title
        cover_image_url
      }
      artists {
        _id
        display_name
        profile_image_url
      }
    }
    getArtistsByName(name: $searchTerm) {
      _id
      display_name
      profile_image_url
      genres
    }
    getAlbumsByTitle(title: $searchTerm) {
      _id
      cover_image_url
      title
      release_date
      artists {
        _id
        display_name
        profile_image_url
      }
    }
  }
`;

type ResultType = {
  artists: {
    _id: string;
    display_name: string;
    profile_image_url: string;
    genres: string[];
  }[];
  playlists: {
    _id: string;
    title: string;
    description: string;
    visibility: string;
    owner: {
      _id: string;
      display_name: string;
      profile_image_url: string;
    };
  }[];
  songs: {
    _id: string;
    title: string;
    duration: number;
    song_url: string;
    writtenBy: string;
    producers: string[];
    language: string;
    genre: string;
    lyrics: string;
    likes: number;
    release_date: string;
    album: {
      _id: string;
      title: string;
      cover_image_url: string;
    };
    artists: {
      _id: string;
      display_name: string;
      profile_image_url: string;
    }[];
  }[];
  albums: {
    _id: string;
    title: string;
    cover_image_url: string;
    release_date: string;
    artists: {
      _id: string;
      display_name: string;
      profile_image_url: string;
    }[];
  }[];
};

const Search: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [results, setResults] = useState<ResultType>({
    artists: [],
    playlists: [],
    songs: [],
    albums: [],
  });
  const { token } = useSelector((state: RootState) => state.user);
  const apolloClient = createApolloClient(token);

  const { data, loading, error } = useQuery(SEARCH_QUERIES, {
    client: apolloClient,
    variables: { searchTerm: debouncedSearchTerm },
    skip: !debouncedSearchTerm, // Skip the query if the search term is empty
  });

  // console.log(data);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [searchTerm]);

  useEffect(() => {
    if (data) {
      setResults({
        artists: data.getArtistsByName,
        playlists: data.getPlaylistsByTitle,
        songs: data.getSongsByTitle,
        albums: data.getAlbumsByTitle,
      });
    } else if (!debouncedSearchTerm) {
      setResults({ artists: [], playlists: [], songs: [], albums: [] });
    }
  }, [data, debouncedSearchTerm]);

  return (
    <div
      className="  flex-col h-full p-5 gap-5 w-full rounded-lg flex items-center relative self-stretch "
      style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
    >
      <div className="min-w-[500px] mx-auto">
        <div className="relative flex items-center w-full h-12 rounded-lg focus-within:shadow-lg bg-white opacity-75 overflow-hidden">
          <div className="grid place-items-center h-full w-12 text-gray-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
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

      <div className="flex flex-col w-full h-full items-center overflow-y-scroll p-4 space-y-4 justify-start ">
        <Songs songs={results.songs} />
        <Artists artists={results.artists} />
        <Playlists playlistsData={{ playlists: results.playlists }} />
        <Albums albums={results.albums} />
      </div>
    </div>
  );
};

export default Search;
