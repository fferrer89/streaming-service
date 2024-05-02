import React from 'react';
import { Separator } from "@/components/ui/separator"

interface SongProps {
  name: string;
  link: string;
}

interface SongsProps {
  songs: SongProps[];
}

const Songs: React.FC<SongsProps> = ({ songs }) => {
  return (
    <div
      className="flex flex-col w-full h-48 gap-3 p-0 bg-white rounded-lg overflow-hidden items-center relative"
      style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)' }}
    >
      <div className="inline-flex  flex-auto items-center relative w-full px-5 pt-3 ">
        <div className="relative w-auto mt-0 font-mono font-medium text-white text-lg text-center tracking-normal ">
          Songs
        </div>
      </div>
      
      <Separator className="w-[95%]" />
      <div className='w-full h-full px-3'>
        {songs.length > 0 ? (
          songs.map((song, index) => (
            <div key={index}>
              <a href={song.link}>{song.name}</a>
            </div>
          ))
        ) : (
          <div>Song not found</div>
        )}
      </div>
    </div>
  );
};

export default Songs;
