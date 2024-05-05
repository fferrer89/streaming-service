// Home.tsx
"use client";
import React from "react";
import { Separator } from "@/components/ui/separator";
import Card from "@/components/App/Feed/Card";
import InfiniteCarousel from "@/components/App/Feed/InfiniteCarousel";
import { useDispatch } from "react-redux";
import { playSong } from "@/utils/redux/features/song/songSlice";

const albums = [
  { id: 1, image: "https://picsum.photos/56.webp?random=10" },
  { id: 2, image: "https://picsum.photos/56.webp?random=11" },
  { id: 3, image: "https://picsum.photos/56.webp?random=9" },
  { id: 4, image: "https://picsum.photos/56.webp?random=5" },
  { id: 5, image: "https://picsum.photos/56.webp?random=12" },
  { id: 6, image: "https://picsum.photos/56.webp?random=3" },
  { id: 7, image: "https://picsum.photos/56.webp?random=7" },
  { id: 8, image: "https://picsum.photos/56.webp?random=8" },
];

const ArtistHome: React.FC = () => {
  const dispatch = useDispatch();

  const handlePlay = (songId: string) => {
    dispatch(
      playSong({
        id: parseInt(songId),
        title: "Sample Song",
        artist: "Sample Artist",
        duration: 180,
        currentTime: 0,
      })
    );
  };

  return (
    <div
      className="w-full h-full bg-cover bg-center overflow-hidden"
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
      <div className="flex flex-col items-start justify-start h-full w-full">
        <div className="flex flex-col items-center justify-center w-full h-auto">
          <div className="w-full flex">
            <h1 className="text-[40px] italic text-center px-5 py-4 font-thin">
              SOUNDS FOR YOU
            </h1>
          </div>
          <Separator className="w-[97%]" />
          <InfiniteCarousel
            items={albums.map((album) => (
              <Card
                onClick={() => {
                  handlePlay(album.id.toString());
                }}
                key={album.id}
                image={album.image}
                songId={album.id.toString()}
              />
            ))}
            speed={0.4}
            direction="left"
          />
        </div>
        <div className="flex flex-col items-center justify-center w-full h-auto">
          <div className="w-full flex">
            <h1 className="text-[40px] italic text-center px-5 py-4 font-thin">
              ARTISTS OF THE WEEK
            </h1>
          </div>
          <Separator className="w-[97%]" />
          <InfiniteCarousel
            items={albums.map((album) => (
              <Card
                rounded="full"
                key={album.id}
                image={album.image}
                songId={album.id.toString()}
              />
            ))}
            speed={0.4}
            direction="right"
          />
        </div>
      </div>
    </div>
  );
};

export default ArtistHome;
