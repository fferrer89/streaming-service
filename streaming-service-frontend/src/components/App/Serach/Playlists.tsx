import React from 'react';
import { Separator } from "@/components/ui/separator";
import PlaylistItem from './units/playlists';

interface Playlist {
  _id: string;
  title: string;
  description: string;
  visibility: string;
  owner: {
    _id: string;
    display_name: string;
  };
}

interface PlaylistsProps {
  playlistsData: {
    playlists: Playlist[];
  };
}

const Playlists: React.FC<PlaylistsProps> = ({ playlistsData }) => {
  return (
    <div
      className="flex flex-col w-full h-fit gap-3 p-0 bg-white rounded-lg overflow-hidden items-center relative"
      style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)' }}
    >
      <div className="inline-flex flex-auto items-center relative w-full px-5 pt-3">
        <div className="relative w-auto mt-0 font-mono font-medium text-white text-lg text-center tracking-normal">
          Playlists
        </div>
      </div>
      <Separator className="w-[95%]" />
      <div className="w-full h-full py-5 px-3 overflow-x-auto flex flex-row">
        {playlistsData.playlists.length > 0 ? (
          playlistsData.playlists.map((playlist, index) => (
            <PlaylistItem
              key={index}
              _id={playlist._id}
              title={playlist.title}
              description={playlist.description}
              visibility={playlist.visibility}
              owner={playlist.owner}
            />
          ))
        ) : (
          <div>Playlist not found</div>
        )}
      </div>
    </div>
  );
};

export default Playlists;