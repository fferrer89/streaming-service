import React from 'react';

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
    const getImageUrl = (id: string) => {
       
        return `http://localhost:4000/file/image/${id}`;
    };
  return (
    <a href={`/playlist/${_id}`} className="m-2 p-2 rounded-lg shadow-md hover:scale-105 transition-transform flex flex-col items-center">
        <img src={owner.profile_image_url ? getImageUrl(owner.profile_image_url) : "/img/placeholder-album.png"} alt={title} className="w-16 h-16 rounded-lg object-cover" />
        <span className="mt-1 text-sm font-semibold text-gray-800">
        {title}
      </span>
    </a>
  );
};

export default PlaylistItem;