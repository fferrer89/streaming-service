// Songs.tsx
import React from 'react';
import { Separator } from "@/components/ui/separator";
import SongItem from './units/song';

interface SongProps {
  _id: string;
  title: string;
  duration: number;
  song_url: string;
  cover_image_url: string;
  writtenBy: string;
  producers: string[];
  language: string;
  genre: string;
  lyrics: string;
  release_date: Date;
  album: {
    _id: string;
    title: string;
  };
  artists: {
    _id: string;
    display_name: string;
  }[];
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
      <div className="inline-flex flex-auto items-center relative w-full px-5 pt-3">
        <div className="relative w-auto mt-0 font-mono font-medium text-white text-lg text-center tracking-normal">
          Songs
        </div>
      </div>
      <Separator className="w-[95%]" />
      <div className="w-full h-full px-3">
        {songs.length > 0 ? (
          songs.map((song, index) => (
            <div key={index} className="overflow-x-auto">
              <div className="flex flex-nowrap justify-start px-4">
                <SongItem
                  _id={song._id}
                  title={song.title}
                  duration={song.duration}
                  song_url={song.song_url}
                  cover_image_url={song.cover_image_url}
                  writtenBy={song.writtenBy}
                  producers={song.producers}
                  language={song.language}
                  genre={song.genre}
                  lyrics={song.lyrics}
                  release_date={song.release_date}
                  album={song.album}
                  artists={song.artists}
                />
              </div>
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