// Songs.tsx
import React from 'react';
import { Separator } from "@/components/ui/separator";
import SongItem from './units/song';
import { useDispatch } from 'react-redux';
import { playSong } from '@/utils/redux/features/song/songSlice';

interface SongProps {
  _id: string;
  title: string;
  duration: number;
  song_url: string;
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
    profile_image_url: string;
  }[];
}

interface SongsProps {
  songs: SongProps[];
}

const Songs: React.FC<SongsProps> = ({ songs }) => {
  const dispatch = useDispatch();

  function PlaySong(song: SongProps) {
    dispatch(playSong({ ...song, currentTime: 0 }));
  }

  return (
    <div
      className="flex flex-col w-[1050px] h-[500px] gap-3 p-0 bg-white rounded-lg overflow-hidden relative"
      style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)' }}
    >
      <div className="flex items-center px-5 pt-1">
        <div className="font-mono font-medium text-white text-lg text-center tracking-normal">
          Songs
        </div>
      </div>
      <Separator className="w-[95%]" />
      <div className="flex-1 overflow-x-auto">
        <div className="grid grid-flow-col auto-cols-max gap-4 py-5 px-3">
          {songs.length > 0 ? (
            songs.map((song, index) => (
              <SongItem
                key={song._id}
                _id={song._id}
                title={song.title}
                duration={song.duration}
                song_url={song.song_url}
                cover_image_url={song.artists[0].profile_image_url}
                writtenBy={song.writtenBy}
                producers={song.producers}
                language={song.language}
                genre={song.genre}
                lyrics={song.lyrics}
                release_date={song.release_date}
                album={song.album}
                artists={song.artists}
                onClick={() => PlaySong(song)}
              />
            ))
          ) : (
            <div>Song not found</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Songs;