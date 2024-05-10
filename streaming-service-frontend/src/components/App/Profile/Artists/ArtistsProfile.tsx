// ArtistProfile.tsx
//@ts-nocheck
"use client";
import React, { useContext } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GetSongsByArtistID } from "@/utils/graphql/queries";
import queries from "@/utils/queries";
import ArtistProfileImage from "@/components/App/Artist/ArtistProfileImage";
import { SongsByArtistID } from "@/utils/graphql/resultTypes";
import { gql } from "@apollo/client";
import Songs from "@/components/App/Serach/Songs";
import Albums from "@/components/App/Serach/Albums";
import { RootState } from "@/utils/redux/store";
import { useSelector } from "react-redux";

interface ArtistProfileProps {
  params: { id: string };
}

const ArtistProfile: React.FC<ArtistProfileProps> = ({ params }) => {
  const userId = useSelector((state: RootState) => state.user.userId);
  const { data: artistData, loading: artistLoading, error: artistError } = useQuery(queries.GET_ARTIST_BY_ID, {
    variables: { id: params.id },
  });

  const { data: songsData, loading: songsLoading, error: songsError } = useQuery<{ getSongsByArtistID: SongsByArtistID[] }>(
    GetSongsByArtistID,
    {
      variables: { artistId: params.id },
    }
  );

  const GetAlbumsByArtistID = gql`
  query Query($artistId: ID!) {
  getAlbumsByArtist(artistId: $artistId) {
    _id
    album_type
    cover_image_url
    title
    release_date
    artists {
      _id
      display_name
      profile_image_url
    }
  }
}`;
  const { data: albumsData, loading: albumsLoading, error: albumsError } = useQuery<{ getAlbumsByArtist:any }>(
    GetAlbumsByArtistID,
    {
      variables: { artistId: params.id },
    }
  );

  const [toggleFollowArtist] = useMutation(queries.TOGGLE_FOLLOW_ARTIST, {
    variables: { id: params.id },
    refetchQueries: [{ query: queries.GET_ARTIST_BY_ID, variables: { id: params.id } }],
  });
  const userType = useSelector((state: RootState) => state.user.userType);
  if (artistLoading || songsLoading) return <div>Loading...</div>;
  if (artistError || songsError) return <div>Error loading data</div>;

  const artist = artistData && artistData.getArtistById;
  const isCurrentUser = userId === artist && artist._id;
 
  let isFollowing = false;
  if (userType === 'user') {
    isFollowing = artist.followers.users.some((user: { id: string }) => user._id === userId);
  } else if (userType === 'artist') {
    isFollowing = artist.followers.artists.some((artist: { id: string }) => artist._id === userId);
  }

  const handleFollow = () => {
    toggleFollowArtist();
  };

  const date = new Date(artist.created_date);
  const formattedDate = date.toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });


  return (
    <div className="container mx-auto my-5 p-5 rounded-lg h-fit">
      <div className="md:flex no-wrap md:-mx-2">
        <div className="w-full md:w-3/12 md:mx-2">
          <div className="p-3 border-t-4 border-green-400 bg-stone-300">
            <div className="image overflow-hidden">
              <ArtistProfileImage image_url={artist.profile_image_url} size={100} />
            </div>
            <h1 className="text-gray-900 font-bold text-xl leading-8 my-1">{artist.display_name}</h1>
            <h3 className="text-gray-600 font-lg text-semibold leading-6">Artist</h3>
            <ul className="bg-gray-200 text-gray-600 hover:text-gray-700 hover:shadow py-2 px-3 mt-3 divide-y rounded shadow-sm">
              <li className="flex items-center py-3">
                <span>Followers</span>
                <span className="ml-auto">{artist.followers.users.length + artist.followers.artists.length}</span>
              </li>
              <li className="flex items-center py-3">
                <span>Following</span>
                <span className="ml-auto">{artist.following.users.length + artist.following.artists.length}</span>
              </li>
              <li className="flex items-center py-3">
                <span>Status</span>
                <span className="ml-auto">
                  <span className="bg-green-500 py-1 px-2 rounded text-white text-sm">Active</span>
                </span>
              </li>
              <li className="flex items-center py-3">
                <span>Member since</span>
                <span className="ml-auto">{formattedDate}</span>
              </li>
              {!isCurrentUser && (
                <li className="flex items-center py-3">
                  <button className="ml-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleFollow}>
                    {isFollowing ? 'Unfollow' : 'Follow'}
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>
        <div className="w-fit mx-2 h-64 space-y-5">
          <div className="bg-stone-300 p-3 shadow-sm rounded-sm">
            <div className="flex items-center space-x-2 font-semibold text-gray-900 leading-8">
              <span className="text-green-500">
                <svg
                  className="h-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </span>
              <span className="tracking-wide">About</span>
            </div>
            <div className="text-gray-700">
              <div className="grid md:grid-cols-2 text-sm">
                <div className="grid grid-cols-2">
                  <div className="px-4 py-2 font-semibold">First Name</div>
                  <div className="px-4 py-2">{artist.first_name}</div>
                </div>
                <div className="grid grid-cols-2">
                  <div className="px-4 py-2 font-semibold">Last Name</div>
                  <div className="px-4 py-2">{artist.last_name}</div>
                </div>
                <div className="grid grid-cols-2">
                  <div className="px-4 py-2 font-semibold">Email</div>
                  <div className="px-4 py-2">{artist.email}</div>
                </div>
                <div className="grid grid-cols-2">
                  <div className="px-4 py-2 font-semibold">Genres</div>
                  <div className="px-4 py-2">{artist.genres.join(", ")}</div>
                </div>
              </div>
            </div>
          </div>
          <div className= "grid grid-cols-1 gap-4 w-full place-items-center">
            <Songs songs={songsData?.getSongsByArtistID || []} />
          </div>
          <div className= "grid grid-cols-1 gap-4 w-full place-items-center">
            <Albums albums={albumsData?.getAlbumsByArtist || []} />
          </div>
        </div>
      </div> 
    </div>
  );
};

export default ArtistProfile;
