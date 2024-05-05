import React from 'react';

interface PlaylistProps {
  _id: string;
  title: string;
  description: string;
  visibility: string;
  owner: {
    _id: string;
    display_name: string;
  };
}

const PlaylistItem: React.FC<PlaylistProps> = ({ _id, title, description, visibility, owner }) => {
  return (
    <a href={`/playlist/${_id}`} className="flex-shrink-0 h-fit w-[200px] m-4 rounded p-4 shadow-lg transition-all duration-700 hover:scale-105 flex flex-col items-center justify-center">
      <div className="relative">
        <img src="/img/placeholder-album.png" alt={title} className="w-[110px] rounded-[10px]" />
      </div>
      <div className="mt-2 text-center text-[#1e1e1e] font-semibold">
        {title}
      </div>
    </a>
  );
};

export default PlaylistItem;