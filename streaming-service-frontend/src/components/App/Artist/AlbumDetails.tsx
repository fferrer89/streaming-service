import React from "react";
import { Separator } from "@/components/ui/separator";

const AlbumDetails: React.FC<{ albumData: any }> = ({ albumData }) => {
  const {
    _id,
    album_type,
    artists,
    cover_image_url,
    description,
    genres,
    release_date,
    songs,
    title,
    total_duration,
    total_songs,
    visibility,
  } = albumData.getAlbumById;
  const imageUrl = `http://localhost:4000/file/download/${cover_image_url}`;
  return (
    <div
      className="flex flex-col w-full h-fit gap-3 p-0 bg-white rounded-lg overflow-hidden items-center relative"
      style={{ backgroundColor: "rgba(255, 255, 255, 0.5)" }}
    >
      <div className="inline-flex flex-auto items-center relative w-full px-5 pt-3">
        <div className="relative w-auto mt-0 font-mono font-medium text-white text-lg text-center tracking-normal">
          Album Details
        </div>
      </div>

      <Separator className="w-[95%]" />

      <div className="w-full py-5 px-3 overflow-x-auto flex flex-row items-start">
        <div className="ml-4 flex flex-col justify-start">
          <div className="p-4">
            <h2 className="text-xl font-bold mb-2">{title}</h2>
            <p className="text-sm text-gray-600 mb-2">{description}</p>
            <p className="text-sm text-gray-600 mb-2">
              Album Type: {album_type}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              Release Date: {release_date}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              Visibility: {visibility}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              Genres: {genres.join(", ")}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              Total Songs: {total_songs}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              Total Duration: {total_duration} seconds
            </p>
            <p className="text-sm text-gray-600 mb-2">
              Artists:{" "}
              {artists.map((artist: any) => artist.display_name).join(", ")}
            </p>
          </div>
          <div className="p-4 border-t border-gray-200">
            <h2 className="text-lg font-bold mb-2">Songs</h2>
            <ul>
              {songs.map((song: any) => (
                <li key={song._id} className="text-sm text-gray-600">
                  {song.title}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="ml-20 flex flex-col justify-start">
          <img className="w-full max-w-md" src={imageUrl} alt={title} />
        </div>
      </div>
    </div>
  );
};

export default AlbumDetails;
