import React from 'react';
import Image from 'next/image';

interface Song {
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
  release_date: string;
  album: {
    _id: string;
    title: string;
  };
  artists: {
    _id: string;
    display_name: string;
  }[];
}

interface SongProps extends Song {
  onClick?: (song: Song) => void;
}

const SongItem: React.FC<SongProps> = ({ onClick, ...song }) => {
  const truncatedTitle = song.title.split(' ');

  return (
    <div className="w-[100px] h-[100px] m-2 p-4 rounded-lg shadow-md hover:scale-105 transition-transform flex flex-col items-center justify-center">
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          onClick?.(song);
        }}
        className="flex flex-col items-center"
      >
        <div>
          <Image
            src={song.cover_image_url}
            alt={song.title}
            width={50}
            height={50}
            className="rounded-lg object-cover"
          />
        </div>
        <span className="mt-1 text-sm font-semibold text-gray-800 text-center break-words max-w-full">
          {truncatedTitle[0]}
        </span>
      </a>
    </div>
  );
};

export default SongItem;