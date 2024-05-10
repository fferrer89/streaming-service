//@ts-nocheck
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface Album {
  _id: string;
  title: string;
  cover_image_url: string;
  release_date: string;
  artists: {
    _id: string;
    display_name: string;
  }[];
}

interface AlbumProps extends Album {
  onClick?: (album: Album) => void;
}

const AlbumItem: React.FC<AlbumProps> = ({ onClick, ...album }) => {
    const pathname = usePathname();
    const firstPathSegment = pathname && pathname.split('/')[1];
    
  return (
    <div className="w-[100px] h-[100px] m-2 p-4 rounded-lg shadow-md hover:scale-105 transition-transform flex flex-col items-center justify-center">
      <Link
       href={`/${firstPathSegment}/album/${album._id}`}
        
        className="flex flex-col items-center"
      >
        <div>
          <img
            src={`${album.cover_image_url}`}
            alt={album.title}
            width={50}
            height={50}
            className="rounded-lg object-cover"
          />
        </div>
        <span className="mt-1 text-sm font-semibold text-gray-800 text-center break-words max-w-full">
          {album.title}
        </span>
      </Link>
    </div>
  );
};

export default AlbumItem;
