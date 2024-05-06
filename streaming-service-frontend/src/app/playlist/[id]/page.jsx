"use client";
import { gql, useQuery } from "@apollo/client";
import { FaTrash } from "react-icons/fa";
// import { PlayListBanner } from "../../../components/playlist/Banner";
// import { client } from "../../../utils/playlistHelper";

import { PlayListBanner } from "@/components/app/playlist/Banner";
import { client } from "@/utils/playlistHelper";
import queries from "@/utils/queries";

export default function Playlist({ params }) {
  console.log(params);
  const { loading, data, error } = useQuery(queries.GET_PLAYLIST, {
    variables: { id: params.id },
    client,
  });
  console.log(data);
  console.log(error);

  if (data) {
    return (
      <div className="flex flex-col w-full">
        <PlayListBanner playlist={data.getPlaylistById} />
        <div className=" flex flex-col" style={{ marginTop: "2rem" }}>
          <div className="flex flex-col justify-between px-4">
            <div
              className="flex flex-row justify-between"
              style={{ paddingBottom: "2.5rem" }}
            >
              <p className="text-lg">Song</p>
              <p>Album</p>
              <p>Duration</p>
            </div>

            {data.getPlaylistById.songs.map((song, index) => {
              return (
                <div
                  key={index}
                  className=" flex justify-between"
                  style={{
                    marginBottom: "1rem",
                    paddingTop: "1rem",
                    paddingBottom: "1rem",
                    borderBottom: "1px solid #ccc",
                    transition: "background-color 0.3s",
                    ":hover": {
                      backgroundColor: "#b0b0b0",
                    },
                  }}
                >
                  <p>{song.title}</p>
                  <p>{song.album.title}</p>
                  <div className="flex flex-row">
                    <p>{song.duration}</p>
                    <FaTrash style={{ marginLeft: "1rem" }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}
