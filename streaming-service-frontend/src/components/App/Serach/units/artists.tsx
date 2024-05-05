import React from 'react';

interface ArtistProps {
  _id: string;
  display_name: string;
  profile_image_url: string;
  genres: string[];
}

const ArtistItem: React.FC<ArtistProps> = ({ _id, display_name, profile_image_url, genres }) => {
  return (
    <div className="flex justify-center items-center">
      <a href={`/artist/${_id}`} className="flex-shrink-0 h-fit w-[200px] m-4 rounded p-4 shadow-lg transition-all duration-700 hover:scale-105 flex flex-col items-center justify-center">
        <div className="relative">
          <img src={profile_image_url || "/img/artist-icon.jpeg"} alt={display_name} className="w-[110px] rounded-[10px]" />
        </div>
        <div className="mt-2 text-center text-[#1e1e1e] font-semibold">
          {display_name}
        </div>
      </a>
    </div>
  );
};

export default ArtistItem;