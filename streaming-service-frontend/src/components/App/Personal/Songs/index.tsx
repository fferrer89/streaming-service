'use client'

import React, { useEffect, useState } from 'react';

const Songs: React.FC = () => {
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    // Here is where you would make the request to get the songs
    // For now, we will leave it as an empty array
    setSongs([]);
  }, []);

  return (
    <div
      className="flex flex-col w-full h-48 gap-5 p-0 bg-white rounded-lg overflow-hidden items-center relative"
      style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)' }}
    >
      <div className="flex h-16 pl-5 pr-0 py-2 self-stretch w-full items-center relative">
        <div className="inline-flex gap-4 flex-auto items-center relative">
          <div className="relative w-auto mt-0 font-mono font-medium text-white text-sm text-center tracking-normal leading-normal">
            Songs
          </div>
        </div>
      </div>
      Songs
    </div>
  );
};

export default Songs;
