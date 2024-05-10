'use client'
//@ts-nocheck
import React from 'react';
import { getImageUrl } from '@/utils/tools/images';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

interface PlaylistProps {
  _id: string;
  title: string;
  description: string;
  visibility: string;
  owner: {
    _id: string;
    display_name: string;
    profile_image_url: string;
  };
}

const PlaylistItem: React.FC<PlaylistProps> = ({ _id, title, description, visibility, owner }) => {
  const imageUrl =  "/img/placeholder-album.png";
  const pathname = usePathname();
  const firstPathSegment = pathname && pathname.split('/')[1];

  return (
    <Link href={`/${firstPathSegment}/playlist/${_id}`} className="m-2 p-2 rounded-lg shadow-md hover:scale-105 transition-transform flex flex-col items-center">
        <img src={imageUrl} alt={title} className="w-16 h-16 rounded-lg object-cover" />
        <span className="mt-1 text-sm font-semibold text-gray-800">
        {title}
      </span>
    </Link>
  );
};

export default PlaylistItem;