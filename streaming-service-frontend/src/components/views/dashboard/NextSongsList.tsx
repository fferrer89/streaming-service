import React, { useState } from "react";

const NextSongsList = ({ nextSongs, currentSong }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };
  return (
    <div className="flex justify-between">
      <div className="w-2/3 bg-stone-700 text-white">
        <h3 className="flex justify-between items-center">
          Current Song:
          <button
            onClick={toggleCollapse}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            {isCollapsed ? "Expand" : "Collapse"}
          </button>
        </h3>
        {!isCollapsed && (
          <div className="text-white p-4 bg-stone-800">
            <h4 className="text-xl font-bold">{currentSong.title}</h4>
            <p className="text-lg">
              {currentSong.artists &&
                currentSong.artists
                  .map(
                    (artist: { display_name: string }) => artist.display_name
                  )
                  .join(", ")}
            </p>
            <p className="text-sm">
              Album: {currentSong.album && currentSong.album.title}
            </p>
            <p className="text-sm">
              Released:{" "}
              {currentSong.release_date &&
                new Date(currentSong.release_date).toLocaleDateString()}
            </p>
            <p className="text-sm">Genre: {currentSong.genre}</p>
            <p className="text-sm">
              Lyrics:{" "}
              {currentSong.lyrics ? currentSong.lyrics : "Lyrics not available"}
            </p>
          </div>
        )}
      </div>
      <div className="w-1/3 overflow-y-auto max-h-96 bg-gray-200 text-black">
        {nextSongs.length > 0 && <h3>Next Song: {nextSongs[0].title}</h3>}
        {!isCollapsed && (
          <div className="grid grid-cols-auto-fill gap-2.5">
            {nextSongs.map((song) => (
              <div
                key={song._id}
                className={`p-2.5 border border-stone-800 rounded hover:bg-gray-300 ${
                  song._id === currentSong._id
                    ? "font-bold bg-gray-200"
                    : "bg-gray-200"
                } shadow-sm`}
              >
                {song.title}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NextSongsList;
