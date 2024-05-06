import React from 'react';

interface ArtistProps {
  _id: string;
  display_name: string;
  profile_image_url: string;
  genres: string[];
}

const ArtistItem: React.FC<ArtistProps> = ({ _id, display_name, profile_image_url }) => (
  <a
    href={`/artist/${_id}`}
    className="m-2 p-2 rounded-lg shadow-md hover:scale-105 transition-transform flex flex-col items-center"
  >
    <img
      src={profile_image_url}
      alt={display_name}
      className="w-16 h-16 rounded-lg object-cover"
    />
    <span className="mt-1 text-sm font-semibold text-gray-800">{display_name}</span>
  </a>
);

export default ArtistItem;