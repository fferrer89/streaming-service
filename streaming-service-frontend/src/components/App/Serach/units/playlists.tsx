import React from 'react';

interface Playlist {
  name: string;
  link: string;
}

interface PlaylistProps {
  playlist: Playlist;
}

const PlaylistItem: React.FC<PlaylistProps> = ({ playlist }) => {
  return (
    <a
      href={playlist.link}
      className="flex-shrink-0 h-fit w-[200px] m-4 rounded p-4 shadow-lg transition-all duration-700 hover:scale-105 flex flex-col items-center justify-center"
    >
      <div className="relative">
        <img
          src="/img/placeholder-album.png"
          alt={playlist.name}
          className="w-[110px] rounded-[10px]"
        />
      </div>
      <div className="mt-2 text-center text-[#1e1e1e] font-semibold">
        {playlist.name}
      </div>
    </a>
  );
};



export default PlaylistItem;
