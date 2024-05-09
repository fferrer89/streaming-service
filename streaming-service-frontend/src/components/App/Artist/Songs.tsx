//@ts-nocheck
import React from "react";
import { Separator } from "@/components/ui/separator";
import SongItem from "./units/SongItem";

const Songs: React.FC<{ songs: any }> = ({ songs }) => {
  return (
    <div
      className="flex flex-col w-full h-fit gap-3 p-0 bg-white rounded-lg overflow-hidden items-center relative"
      style={{ backgroundColor: "rgba(255, 255, 255, 0.5)" }}
    >
      <div className="inline-flex flex-auto items-center relative w-full px-5 pt-3">
        <div className="relative w-auto mt-0 font-mono font-medium text-white text-lg text-center tracking-normal">
          Your Songs
        </div>
      </div>

      <Separator className="w-[95%]" />

      <div className="w-full h-full overflow-y-auto grid grid-cols-5 gap-4 p-3">
        {songs?.length > 0 ? (
          songs?.map((song, index) => <SongItem song={song} key={index} />)
        ) : (
          <div className="text-gray-600 text-sm">No Songs</div>
        )}
      </div>
    </div>
  );
};

export default Songs;
