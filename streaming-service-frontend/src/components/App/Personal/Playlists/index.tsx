'use client';
import React, { useEffect, useState } from 'react';
import { Separator } from '@/components/ui/separator';
import { useQuery } from '@apollo/client';
import apolloClient from '@/utils';
import { GetUserPlaylists } from '@/utils/graphql/queries';
import { GetUserPlaylistsVariables, GetUserPlaylist } from '@/utils/graphql/resultTypes';
import { RootState } from '@/utils/redux/store';
import { useSelector } from 'react-redux';

export type GetPlaylistsByOwnerResult = {
  getPlaylistsByOwner: GetUserPlaylist[]; // Ensure this matches the actual structure returned by the server
}

const Playlists: React.FC = () => {
  const [playlists, setPlaylists] = useState<GetUserPlaylist[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const userId = useSelector((state: RootState) => state.user.userId);

  const { loading: queryLoading, error: queryError, data } = useQuery<GetPlaylistsByOwnerResult, GetUserPlaylistsVariables>(
    GetUserPlaylists,
    {
      variables: { userId: userId as string},
      client: apolloClient,
    }
  );

  useEffect(() => {
    if (!queryLoading && !queryError && data) {
      setPlaylists(data.getPlaylistsByOwner);
      setLoading(false);
    } else if (queryError) {
      setError('Error fetching playlists');
      setLoading(false);
    }
  }, [queryLoading, queryError, data, userId]);

  return (
    <div
      className="flex flex-col w-full h-auto gap-5 p-0 bg-white rounded-lg overflow-hidden items-center relative justify-start"
      style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)' }}
    >
      <div className="inline-flex gap-4 flex-auto items-start relative w-full px-5 pt-3 flex-col">
        <div className="relative w-auto mt-0 font-mono font-medium text-black text-lg text-center tracking-normal leading-normal">
          Playlists
        </div>
        <Separator className="w-[95%] " />
      </div>
      <div className='w-full px-3 py-2 overflow-y-auto'>
        {loading ? (
          <div className="flex justify-center items-center h-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
          </div>
        ) : error ? (
          <div className="text-center py-10 text-red-500">{error}</div>
        ) : (
          playlists.map((playlist, index) => (
            <div key={index} className="flex items-center justify-between bg-gray-100 rounded-lg p-3 mb-2 shadow hover:bg-gray-200 transition-colors opacity-75">
              <img src="/img/music_note.jpeg" alt="Music note icon" className="w-8 h-8 object-cover border border-black" />
              <span className="text-gray-800 text-sm font-semibold">{playlist.title}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Playlists;
