import React from "react";
import ArtistSideNav from "@/components/App/side-nav/artist-side-nav";
import Personal from "../Personal";

const ArtistSidebar: React.FC = () => {
  return (
    <div className="flex flex-col gap-2 w-[350px] h-full p-2 justify-start items-start ">
      <ArtistSideNav />
      <Personal />
    </div>
  );
};

export default ArtistSidebar;
