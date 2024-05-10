"use client";

import React, { useState, useEffect } from "react";
import { BiPlus } from "react-icons/bi";
import { useMutation } from "@apollo/client";
import queries from "@/utils/queries";
import { PlayListModal } from "./PlaylistModal";
import { useQuery } from "../../../../node_modules/@apollo/client/index";
import createApolloClient from "@/utils";
import { FaCheckCircle } from "react-icons/fa";
import { IoMdAddCircleOutline } from "react-icons/io";

export const FloatingAddButton = () => {
  return (
    <div
      className="flex justify-center items-center w-6 hover:cursor-pointer"
      style={{
        backgroundColor: "#a7a8a7",
        borderRadius: "300px",
        width: "60px",
        height: "60px",
        boxShadow:
          "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
        position: "fixed",
        bottom: "3rem",
        right: "3rem",
      }}
    >
      <BiPlus size={"35px"} />
    </div>
  );
};

const AddSongForm = ({ data: playlistData }) => {
  const { token } = useSelector((state) => state.user);
  const apolloClient = createApolloClient(token);
  // console.log(playlistData);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const { data, loading, error } = useQuery(queries.GET_SONG_BY_TITLE, {
    client,
    variables: { searchTerm: debouncedSearchTerm },
    skip: debouncedSearchTerm.trim().length < 3, // Skip the query if the search term is less than 3 char
  });
  const [
    addSongTOPlaylisr,
    { data: mutationData, loading: mutationLoading, error: mutationError },
  ] = useMutation(queries.ADD_SONG_TO_PLAYLIST, {
    refetchQueries: [queries.GET_PLAYLIST],
    client,
  });

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  if (error) {
    console.log(error);
  }

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
      setResults(data.getSongsByTitle);
    } else if (!debouncedSearchTerm) {
      setResults([]);
    }
  }, [data, debouncedSearchTerm]);

  return (
    <div
      className="flex flex-col justify-center items-center"
      style={{
        maxHeight: "700px",
        minWidth: "400px",
        paddingBottom: "4rem",
        // overflow: "scroll",
      }}
    >
      <p className="text-lg" style={{ margin: "2rem" }}>
        Add Songs!
      </p>
      <div>
        <label htmlFor="title" className="self-start">
          Title{" "}
        </label>
        <input
          className="border border-gray-300 p-1 rounded"
          style={{ width: "full" }}
          type="text"
          id="search"
          placeholder="Atleast 3 letters"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>
      <div
        className="flex flex-col"
        style={{ overflow: "scroll", width: "100%" }}
      >
        {data &&
          data.getSongsByTitle.map((song, index) => {
            return (
              <div
                key={index}
                className="flex flex-row justify-between border"
                style={{
                  alignSelf: "flex-start",
                  padding: "1rem",
                  margin: "2rem",
                  width: "80%",
                }}
              >
                <div className="flex flex-col">
                  <p className="text-md">{song.title}</p>
                  <div className="flex flex-row ">
                    {song.artists &&
                      song.artists.map((artist, index) => {
                        return (
                          <span
                            key={index}
                            className="text-xs"
                            style={{ marginLeft: "0.3rem" }}
                          >
                            {` ${artist.first_name} ${artist.last_name}`}{" "}
                          </span>
                        );
                      })}
                  </div>
                </div>
                <div className="slef-center items-center align-middle">
                  <button
                    onClick={() => {
                      addSongTOPlaylisr({
                        variables: {
                          playlistId: playlistData._id,
                          songId: song._id,
                        },
                      });
                    }}
                  >
                    <IoMdAddCircleOutline size={"30px"} />
                  </button>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export const AddSong = ({ data }) => {
  return (
    <PlayListModal
      CustomForm={AddSongForm}
      Icon={FloatingAddButton}
      modalId={`AddSongToPlaylist`}
      FormData={data}
    />
  );
};
