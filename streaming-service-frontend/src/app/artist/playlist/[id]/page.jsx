"use client";
import { gql, useQuery } from "@apollo/client";
import { FaTrash } from "react-icons/fa";
import { PlayListBanner } from "@/components/App/playlist/Banner";
import createApolloClient from "@/utils";
import queries from "@/utils/queries";
import { AddSong } from "@/components/App/playlist/AddSong";
import { useMutation } from "@apollo/client";
import { useDispatch } from "react-redux";
import { playSong } from "@/utils/redux/features/song/songSlice";
import { useSelector } from "react-redux";
export default function Playlist({ params }) {
  const { token } = useSelector((state) => state.user);
  const apolloClient = createApolloClient(token);
  const dispatch = useDispatch();
  //console.log(params);
  const { loading, data, error } = useQuery(queries.GET_PLAYLIST, {
    variables: { id: params.id },
    client: apolloClient,
    fetchPolicy: "cache-and-network",
    onCompleted: (data) => {
      if (data && data.getPlaylistById && data.getPlaylistById.songs) {
        console.log("Songs list loaded successfully.");
      }
    },
  });
  const [
    removeSong,
    { data: mutationData, loading: mutationLoading, error: mutationError },
  ] = useMutation(queries.REMOVE_SONG_FROM_PLAYLIST, {
    refetchQueries: [queries.GET_PLAYLIST],
    client: apolloClient,
  });
  //console.log("playlists",data);
  //console.log(error);
  if (loading) return <div className="text-center text-lg">Loading...</div>;
  if (error)
    return (
      <div className="text-center text-lg text-red-500">
        Error loading playlist
      </div>
    );

  if (data) {
    return (
      <div
        className="flex flex-col w-full  p-5 rounded-lg shadow-lg"
        style={{ backgroundColor: "rgba(255, 255, 255, 0.8)" }}
      >
        <PlayListBanner playlist={data.getPlaylistById} />
        <div className="flex flex-col mt-8">
          <div className="flex flex-col justify-between px-4">
            <div className="flex flex-row justify-between pb-10">
              <p className="text-lg font-semibold px-5 text-black">Song</p>
              <p className="font-semibold text-black">Album</p>
              <p className="font-semibold text-black">Duration</p>
            </div>

            {data.getPlaylistById.songs.map((song, index) => {
              return (
                <div
                  key={index}
                  className="flex justify-between items-center mb-4 py-4 border-b border-gray-300 transition-colors duration-300 hover:bg-gray-200"
                  onClick={() => dispatch(playSong({ song, currentTime: 0 }))}
                >
                  <p className="text-gray-800">{song.title}</p>
                  <p className="text-gray-600">{song.album?.title}</p>
                  <div className="flex items-center">
                    <p className="text-gray-800">{song.duration}</p>
                    {data.getPlaylistById.isOwner && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeSong({
                            variables: {
                              playlistId: data.getPlaylistById._id,
                              songId: song._id,
                            },
                          });
                        }}
                        className="ml-4 p-2 rounded-full hover:bg-red-500 hover:text-white transition-colors duration-300"
                      >
                        <FaTrash />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <AddSong data={data.getPlaylistById} />
        </div>
      </div>
    );
  } else {
    return <div className="text-center text-lg">No data found</div>;
  }
}
