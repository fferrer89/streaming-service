import React from 'react';

interface Artist {
  name: string;
  link: string;
}

interface ArtistProps {
  artist: Artist;
}

const ArtistItem: React.FC<ArtistProps> = ({ artist }) => {
  return (
    <div className="flex justify-center items-center">
        <a
        href={artist.link}
        className="flex-shrink-0 h-fit w-[200px] m-4 rounded p-4 shadow-lg transition-all duration-700 hover:scale-105 flex flex-col items-center justify-center"
        >
        <div className="relative">
            <img
            src="/img/artist-icon.jpeg"
            alt={artist.name}
            className="w-[110px] rounded-[10px]"
            />
        </div>
        <div className="mt-2 text-center text-[#1e1e1e] font-semibold">
            {artist.name}
        </div>
        </a>
    </div>
  );
};

export default ArtistItem;
