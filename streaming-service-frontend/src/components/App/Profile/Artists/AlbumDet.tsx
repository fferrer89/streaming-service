import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { gql } from '@apollo/client';
import AlbumItem from '@/components/App/Serach/units/album';
import Songs from "@/components/App/Serach/Songs";
import { useSelector } from 'react-redux';

const GetAlbumByID = gql`
  query GetAlbumById($id: ID!) {
  getAlbumById(_id: $id) {
    _id
    album_type
    total_songs
    cover_image_url
    title
    description
    release_date
    created_date
    last_updated
    genres
    likes
    total_duration
    visibility
    artists {
      _id
      display_name
      profile_image_url
    }
    songs {
      _id
      song_url
      cover_image_url
      title
    }
    liked_by {
      artists
      users
    }
  }
}
`;

const ToggleLikeAlbum = gql`
  mutation Mutation($id: ID!, $albumId: ID!) {
  toggleLikeAlbum(_id: $id, albumId: $albumId) {
    _id
    liked_by {
      artists
      users
    }
    likes
  }
}
`;

interface AlbumDetailsProps {
  params: { id: string };
}

const AlbumDet: React.FC<AlbumDetailsProps> = ({ params }) => {
  const { data: albumData, loading: albumLoading, error: albumError } = useQuery<{ getAlbumById: any }>(
    GetAlbumByID,
    {
      variables: { id: params.id },
    }
  );
  const userId = useSelector(
    (state: { user: { userId: string | null } }) => state.user.userId
  );
  const [toggleLike] = useMutation(ToggleLikeAlbum);

  const handleLikeToggle = async () => {
    try {
      await toggleLike({ variables: { id:userId, albumId: params.id } });
    } catch (error) {
      console.error('Error toggling like on album:', error);
    }
  };

  if (albumLoading) return <div className="text-center text-lg font-semibold">Loading...</div>;
  if (albumError) return <div className="text-center text-lg font-semibold text-red-500">Error loading album details</div>;

  const album = albumData && albumData.getAlbumById;
  const isLikedByCurrentUser = album.liked_by.users.some((liker: string) => liker === userId) || album.liked_by.artists.some((liker: string) => liker === userId);

  return (
    <div className="container mx-auto my-5 p-5 rounded-lg shadow-lg bg-stone-400">
      <div className="md:flex no-wrap md:-mx-2">
        <div className="w-full md:w-3/12 md:mx-2">
          <div className="overflow-hidden rounded-lg">
            <img
              src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/file/download/${album.cover_image_url}`}
              alt={album.title}
              className="w-full h-auto object-cover"
            />
          </div>
          <h3 className="mt-2 text-lg font-semibold text-gray-800 text-center break-words">
            {album.title}
          </h3>
          <button onClick={handleLikeToggle} className={`mt-4 px-4 py-2 ${isLikedByCurrentUser ? 'bg-red-500' : 'bg-blue-500'} text-white rounded hover:${isLikedByCurrentUser ? 'bg-red-600' : 'bg-blue-600'}`}>
            {isLikedByCurrentUser ? 'Unlike' : 'Like'}
          </button>
        </div>
        <div className="w-full md:w-9/12 mx-2">
          <div className="bg-white p-3 shadow-sm rounded-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Album Details</h2>
            <div className="text-gray-700">
              <div className="grid md:grid-cols-2 text-sm">
                <div className="grid grid-cols-2">
                  <div className="px-4 py-2 font-semibold">Album Title</div>
                  <div className="px-4 py-2">{album.title}</div>
                </div>
                <div className="grid grid-cols-2">
                  <div className="px-4 py-2 font-semibold">Album Type</div>
                  <div className="px-4 py-2">{album.album_type}</div>
                </div>
                <div className="grid grid-cols-2">
                  <div className="px-4 py-2 font-semibold">Likes</div>
                  <div className="px-4 py-2">{album.likes}</div>
                </div>
                <div className="grid grid-cols-2">
                  <div className="px-4 py-2 font-semibold">Release Date</div>
                  <div className="px-4 py-2">{new Date(album.release_date).toLocaleDateString()}</div>
                </div>
                <div className="grid grid-cols-2">
                  <div className="px-4 py-2 font-semibold">Artists</div>
                  <div className="px-4 py-2">{album.artists.map((artist: { display_name: string }) => artist.display_name).join(", ")}</div>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 w-full mt-4 place-items-center">
            <Songs songs={album.songs || []} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlbumDet;
