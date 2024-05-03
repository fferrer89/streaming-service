import React from 'react';
import { Separator } from "@/components/ui/separator"
import ArtistItem from './units/artists';

interface ArtistProps {
  name: string;
  link: string;
}

interface ArtistsProps {
  artists: ArtistProps[];
}

const Artists: React.FC<ArtistsProps> = ({ artists }) => {
  return (
    <div
      className="flex flex-col w-full h-fit gap-3 p-0 bg-white rounded-lg overflow-hidden items-center relative"
      style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)' }}
    >
      <div className="inline-flex  flex-auto items-center relative w-full px-5 pt-3 ">
        <div className="relative w-auto mt-0 font-mono font-medium text-white text-lg text-center tracking-normal ">
          Artists
        </div>
      </div>
      
      <Separator className="w-[95%]" />
      <div className='w-full h-full py-5 px-3 overflow-x-auto flex flex-row'>
        {artists.length > 0 ? (
          artists.map((artist, index) => (
        
            <ArtistItem artist={artist} key={index} />
        
          ))
        ) : (
          <div>Artist not found</div>
        )}
      </div>
    </div>
  );
};

export default Artists;
