// Artists.tsx
import React from 'react';
import { Separator } from "@/components/ui/separator";
import ArtistItem from './units/artists';
import { getImageUrl } from '@/utils/tools/images';

interface ArtistProps {
  _id: string;
  display_name: string;
  profile_image_url: string;
  genres: string[];
}

interface ArtistsProps {
  artists: ArtistProps[];
}



const Artists: React.FC<ArtistsProps> = ({ artists }) => {

    
    
  return (
    <div
      className="flex flex-col w-[1050px] h-[500px] gap-3 p-0 bg-white rounded-lg overflow-hidden relative"
      style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)' }}
    >
      <div className="flex items-center px-5 pt-1">
        <div className="font-mono font-medium text-white text-lg text-center tracking-normal">
          Artists
        </div>
      </div>
      <Separator className="w-[95%]" />
      <div className="grid grid-flow-col auto-cols-max gap-4 py-5 px-3 overflow-x-auto">
        {artists.length > 0 ? (
          artists.map((artist, index) => (
            <ArtistItem
              key={index}
              _id={artist._id}
              display_name={artist.display_name}
              profile_image_url={artist.profile_image_url ? getImageUrl(artist.profile_image_url) : "/img/artist-icon.jpeg"}
              genres={artist.genres}
            />
          ))
        ) : (
          <div>Artist not found</div>
        )}
      </div>
    </div>
  );
};

export default Artists;