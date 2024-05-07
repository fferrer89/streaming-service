import React, { useState } from "react";

const NextSongsList = ({ nextSongs, currentSongId }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div>
      <h3>
        Next Songs:
        <button onClick={toggleCollapse}>
          {isCollapsed ? "Expand" : "Collapse"}
        </button>
      </h3>
      {!isCollapsed && (
        <ul>
          {nextSongs.map((song) => (
            <li
              key={song._id}
              style={{
                fontWeight: song._id === currentSongId ? "bold" : "normal",
              }}
            >
              {song.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NextSongsList;
