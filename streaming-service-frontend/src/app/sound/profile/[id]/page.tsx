
// ArtistAlbum.tsx
"use client";
import React from "react";
import ArtistProfile from "@/components/App/Profile/Artists/ArtistsProfile";
import { Separator } from "@/components/ui/separator";

const Artist: React.FC<{ params: { id: string } }> = ({ params }) => {
  return (
    <div
      className="w-full h-full bg-cover bg-center overflow-x-hidden"
      style={{
        backgroundImage: 'url("/img/app-background.png")',
        borderRadius: "1rem",
        border: "1px solid #ffffff",
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        backgroundBlendMode: "overlay",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="w-full h-full items-start overflow-y-scroll p-4 space-y-4">
        <ArtistProfile params={params} />
      </div>
    </div>
  );
};

export default Artist;
