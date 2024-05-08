import React from "react";
import Link from "next/link";
interface Song {
  _id: string;
}

interface Album {
  _id: string;
  title: string;
  album_type: string;
  description: string;
  release_date: string;
  visibility: string;
  genres: string[];
  songs: Song[];
  cover_image_url: string;
}
interface AlbumProps {
  album: Album;
}

const AlbumItem: React.FC<AlbumProps> = ({ album }) => {
  const albumLink = `albums/${album._id}`;
  return (
    <div className="flex justify-center items-center">
      <Link
        href={albumLink}
        className="flex-shrink-0 h-[150px] w-[150px] m-4 rounded p-4 shadow-lg transition-all duration-700 hover:scale-105 flex flex-col items-center justify-center"
      >
        <div className="relative">
          <img
            src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/file/download/${album.cover_image_url}`}
            alt={album.title}
            className="w-[110px] rounded-[10px]"
          />
        </div>
        <div className="mt-2 text-center text-[#1e1e1e] font-semibold">
          {album.title}
        </div>
      </Link>
    </div>
  );
};

export default AlbumItem;
