'use client'

import React, { useEffect, useState } from 'react';

const Songs: React.FC = () => {
  const [songs, setSongs] = useState<string[]>([]);

  useEffect(() => {
    // Here is where you would make the request to get the songs
    // For now, we will leave it as an array of example songs
    setSongs(['Song 1', 'Song 2', 'Song 3']);
  }, []);

  return (
    <div
      className="flex flex-col w-full h-48 gap-5 p-0 bg-white rounded-lg overflow-hidden items-center relative"
      style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)' }}
    >
      
        <div className="inline-flex gap-4 flex-auto items-center relative w-full px-5 pt-3">
          <div className="relative w-auto mt-0 font-mono font-medium text-white text-sm text-center tracking-normal leading-normal">
            Songs
          </div>
        </div>
 
      <div className='w-full h-full px-3'>
        {songs.map((song, index) => (
          <div key={index}>{song}</div>
        ))}
      </div>
    </div>
  );
};

export default Songs;
