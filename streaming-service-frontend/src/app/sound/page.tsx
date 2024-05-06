'use client';
import React, { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import Card from "@/components/App/Feed/Card";
import InfiniteCarousel from "@/components/App/Feed/InfiniteCarousel";
import { useDispatch } from "react-redux";
import { playSong } from "@/utils/redux/features/song/songSlice";
import apolloClient from "@/utils";
import { FeedQuery} from "@/utils/graphql/queries"; // Import Feed Query and FeedQueryResult
import { FeedQueryResult } from "@/utils/graphql/resultTypes";

const Home: React.FC = () => {
    const dispatch = useDispatch();
    const [mostLikedSongs, setMostLikedSongs] = useState<FeedQueryResult["getMostLikedSongs"]>([]); // Use FeedQueryResult type to define the state type
    const [mostFollowedArtists, setMostFollowedArtists] = useState<FeedQueryResult["getMostFollowedArtists"]>([]); // Use FeedQueryResult type to define the state type

    useEffect(() => {
        const fetchMostLikedSongsAndArtists = async () => {
            try {
                const { data } = await apolloClient.query({
                    query: FeedQuery ,
                });
                console.log(data);
                setMostLikedSongs(data.getMostLikedSongs.slice(0, 10));
                setMostFollowedArtists(data.getMostFollowedArtists);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchMostLikedSongsAndArtists();
    }, []);

    // Function to cast the image URL
    const getImageUrl = (id: string) => {
       
        return `http://localhost:4000/file/image/${id}`;
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
                        items={mostLikedSongs.map((song) => (
                            <Card
                                onClick={() => {}}
                                key={song._id}
                                image={song.album && song.album.cover_image_url  ? getImageUrl(song.album.cover_image_url) : '/img/music_note.jpeg'}
                                songId={song._id}
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
                        items={mostFollowedArtists.map((artist) => (
                            <Card
                                rounded="full"
                                key={artist._id}
                                image={getImageUrl(artist.profile_image_url)}
                                songId={artist._id}
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

export default Home;
