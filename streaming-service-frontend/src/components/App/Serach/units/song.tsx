import React from 'react';

interface Song {
  title: string;
  link: string;
}

interface SongProps {
  song: Song;
}

const SongItem: React.FC<SongProps> = ({ song }) => {
  return (
    <a
      href={song.link}
      className="flex-shrink-0 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 m-4 rounded p-4 shadow-lg transition-all duration-700 hover:scale-110"
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
    </a>
  );
};

export default SongItem;
