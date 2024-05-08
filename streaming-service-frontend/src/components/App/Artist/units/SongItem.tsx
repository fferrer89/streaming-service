import React from "react";
import Link from "next/link";
const SongItem: React.FC<{ song: any }> = ({ song }) => {
  const albumLink = `songs/${song._id}`;
  return (
    <div className="flex justify-center items-center">
      <Link
        href={albumLink}
        className="flex-shrink-0 h-fit w-[200px] m-4 rounded p-4 shadow-lg transition-all duration-700 hover:scale-105 flex flex-col items-center justify-center"
      >
        <div className="relative">
          <img
            src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/file/download/${song.cover_image_url}`}
            alt={song.title}
            className="w-[110px] rounded-[10px]"
          />
        </div>
        <div className="mt-2 text-center text-[#1e1e1e] font-semibold">
          {song.title}
        </div>
      </Link>
    </div>
  );
};

export default SongItem;
