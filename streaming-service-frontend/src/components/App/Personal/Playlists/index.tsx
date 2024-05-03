'use client';
import React, { useEffect, useState } from 'react';

const Playlists: React.FC = () => {
  const [playlists, setPlaylists] = useState<String[]>([]);

  useEffect(() => {

    setPlaylists(["asd", "asd", "asd"]);
  }, []);

  return (
    <div
      className="flex flex-col w-full h-48 gap-5 p-0 bg-white rounded-lg overflow-hidden items-center relative"
      style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)' }}
    >
      <div className="inline-flex gap-4 flex-auto items-center relative w-full px-5 pt-3">
          <div className="relative w-auto mt-0 font-mono font-medium text-white text-sm text-center tracking-normal leading-normal">
            Playlists
          </div>
        </div>
      <div className='w-full h-full px-3'>
        {playlists.map((playlist, index) => (
          <div key={index}>{playlist}</div>
        ))}
      </div>
   
    </div>
  );
};

export default Playlists;
