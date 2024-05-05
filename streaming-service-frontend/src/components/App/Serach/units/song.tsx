import React from 'react';

interface SongProps {
  _id: string;
  title: string;
  duration: number;
  song_url: string;
  cover_image_url: string;
  writtenBy: string;
  producers: string[];
  language: string;
  genre: string;
  lyrics: string;
  release_date: Date;
  album: {
    _id: string;
    title: string;
  };
  artists: {
    _id: string;
    display_name: string;
  }[];
}

const SongItem: React.FC<SongProps> = ({ _id, title, cover_image_url }) => {
  return (
    <a href={`/song/${_id}`} className="flex-shrink-0 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 m-4 rounded p-4 shadow-lg transition-all duration-700 hover:scale-110">
      <div className="relative">
        <img src={cover_image_url || "/img/music_note.jpeg"} alt={title} className="w-full rounded-[10px]" />
      </div>
      <div className="mt-2 text-center text-[#1e1e1e] font-semibold">
        {title}
      </div>
    </a>
  );
};

export default SongItem;