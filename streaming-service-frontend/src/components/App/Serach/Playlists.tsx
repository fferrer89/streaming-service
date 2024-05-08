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
    profile_image_url: string;
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
    className="flex flex-col w-[95%] gap-3 p-0 bg-white rounded-lg overflow-hidden relative"
    style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)' }}
    >
      <div className="flex items-center px-5 pt-1">
      <div className="font-mono font-medium text-white text-lg text-center tracking-normal">
        Playlists
        </div>
      </div>
      <Separator className="w-[95%]" />
      <div className="grid grid-flow-col auto-cols-max gap-4 py-5 px-3 overflow-x-auto">
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