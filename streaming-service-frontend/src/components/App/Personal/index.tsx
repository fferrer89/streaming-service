import React from 'react';
import Playlists from './Playlists';
import Songs from './Songs';

const Personal: React.FC = () => {
  return (
    <div
      className="flex-col h-full max-h-full gap-5 px-4 pb-4 w-full rounded-lg overflow-hidden flex items-center relative self-stretch"
      style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
    >
      <div className="h-16 justify-between p-2 w-full flex items-center relative self-stretch">
        <div className="inline-flex gap-4 flex-auto mt-0 mb-0 items-center relative">
          <img className="relative w-8 h-8 object-cover" alt="Library icon" src="/icons/library_icon.png" />
          <div className="relative w-auto font-mono font-medium text-white text-xl text-center tracking-normal leading-normal">
            Your Sounds
          </div>
        </div>
        <div className="flex flex-col w-fit h-fit gap-2 rounded-full items-center justify-center"
        style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)' }}
        >
          <div 
            className="flex items-center justify-center w-8 h-8 font-mono font-thin text-xl whitespace-nowrap text-white text-center tracking-normal leading-normal rounded-full"
          >
            +
          </div>
        </div>
      </div>
        <Playlists/>
        <Songs/>
    </div>
  );
};

export default Personal;