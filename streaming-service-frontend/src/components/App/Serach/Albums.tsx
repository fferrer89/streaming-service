import React from 'react';
import { Separator } from "@/components/ui/separator";
import AlbumItem from './units/album';
import { useDispatch } from 'react-redux';

interface AlbumProps {
    _id: string;
    title: string;
    cover_image_url: string;
    release_date: string;
    artists: {
      _id: string;
      display_name: string;
      profile_image_url: string;
    }[];
}

interface AlbumsProps {
  albums: AlbumProps[];
}

const Albums: React.FC<AlbumsProps> = ({ albums }) => {
    const dispatch = useDispatch();

    
  
    return (
        <div
        className="flex flex-col w-[95%] gap-3 p-0 bg-white rounded-lg overflow-hidden relative"
        style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)' }}
        >
        <div className="flex items-center px-5 pt-1">
            <div className="font-mono font-medium text-white text-lg text-center tracking-normal">
            Albums
            </div>
        </div>
        <Separator className="w-[95%]" />
        <div className="flex-1 overflow-x-auto">
            <div className="grid grid-flow-col auto-cols-max gap-4 py-5 px-3">
            {albums && albums.length > 0 ? (
                albums.map((album, index) => (
                <AlbumItem
                    key={album._id}
                    _id={album._id}
                    title={album.title}
                    cover_image_url={`${process.env.NEXT_PUBLIC_API_BASE_URL}/file/download/${album.cover_image_url}`}
                    release_date={album.release_date}
                    artists={album.artists}
                />
                ))
            ) : (
                <div>Album not found</div>
            )}
            </div>
        </div>
        </div>
    );
};

export default Albums;
