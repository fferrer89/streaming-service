import React from "react";
import { Separator } from "@/components/ui/separator";

const SongDetails: React.FC<{ songData: any }> = ({ songData }) => {
  const {
    _id,
    album,
    artists,
    cover_image_url,
    duration,
    genre,
    language,
    likes,
    lyrics,
    producers,
    release_date,
    song_url,
    title,
    writtenBy,
  } = songData.getSongById;
  const imageUrl = `http://localhost:4000/file/download/${cover_image_url}`;
  return (
    <div
      className="flex flex-col w-full h-fit gap-3 p-0 bg-white rounded-lg overflow-hidden items-center relative"
      style={{ backgroundColor: "rgba(255, 255, 255, 0.5)" }}
    >
      <div className="inline-flex flex-auto items-center relative w-full px-5 pt-3">
        <div className="relative w-auto mt-0 font-mono font-medium text-white text-lg text-center tracking-normal">
          Song Details
        </div>
      </div>

      <Separator className="w-[95%]" />

      <div className="w-full py-5 px-3 overflow-x-auto flex flex-row items-start">
        <div className="ml-4 flex flex-col justify-start">
          <img className="w-full max-w-md" src={imageUrl} alt={title} />
          <div className="p-4">
            <h2 className="text-xl font-bold mb-2">{title}</h2>
            <p className="text-sm text-gray-600 mb-2">Album: {album.title}</p>
            <p className="text-sm text-gray-600 mb-2">
              Artists:{" "}
              {artists.map((artist: any) => artist.display_name).join(", ")}
            </p>
            <p className="text-sm text-gray-600 mb-2">Duration: {duration}</p>
            <p className="text-sm text-gray-600 mb-2">Genre: {genre}</p>
            <p className="text-sm text-gray-600 mb-2">Language: {language}</p>
            <p className="text-sm text-gray-600 mb-2">Likes: {likes}</p>
            <p className="text-sm text-gray-600 mb-2">Lyrics: {lyrics}</p>
            <p className="text-sm text-gray-600 mb-2">
              Producers: {producers.join(", ")}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              Release Date: {release_date}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              Song URL: <a href={song_url}>{song_url}</a>
            </p>
            <p className="text-sm text-gray-600 mb-2">
              Written By: {writtenBy}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SongDetails;
