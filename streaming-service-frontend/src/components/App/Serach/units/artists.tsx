import React from 'react';

interface Artist {
  _id: string;
  display_name: string;
  profile_image_url: string;
  genres: string[];
}

interface ArtistProps extends Artist {
    onClick?: (id: string) => void;
}

const ArtistItem: React.FC<ArtistProps> = ({ _id, display_name, profile_image_url , onClick}) => (
  <div
    className="m-2 p-2 rounded-lg shadow-md hover:scale-105 transition-transform flex flex-col items-center"
    onClick={()=>{onClick?.(_id)}}
  >
    <img
      src={profile_image_url || '/img/placeholder-artist.png'}
      alt={display_name}
      className="w-16 h-16 rounded-lg object-cover"
    />
    <span className="mt-1 text-sm font-semibold text-gray-800">{display_name}</span>
  </div>
);

export default ArtistItem;