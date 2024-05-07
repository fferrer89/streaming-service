import React from "react";
import { Separator } from "@/components/ui/separator";
import AlbumItem from "./units/AlbumItem";

interface Song {
  _id: string;
}

interface Album {
  _id: string;
  title: string;
  album_type: string;
  description: string;
  release_date: string;
  visibility: string;
  genres: string[];
  songs: Song[];
  cover_image_url: string;
}
interface AlbumsProps {
  albums: Album[];
}

const Albums: React.FC<AlbumsProps> = ({ albums }) => {
  return (
    <div
      className="flex flex-col w-full h-fit gap-3 p-0 bg-white rounded-lg overflow-hidden items-center relative"
      style={{ backgroundColor: "rgba(255, 255, 255, 0.5)" }}
    >
      <div className="inline-flex  flex-auto items-center relative w-full px-5 pt-3 ">
        <div className="relative w-auto mt-0 font-mono font-medium text-white text-lg text-center tracking-normal ">
          Your Albums
        </div>
      </div>

      <Separator className="w-[95%]" />
      <div className="w-full h-full overflow-y-auto grid grid-cols-5 gap-4 p-3">
        {albums.length > 0 ? (
          albums.map((album, index) => <AlbumItem album={album} key={index} />)
        ) : (
          <div>No Albums</div>
        )}
      </div>
    </div>
  );
};

export default Albums;
