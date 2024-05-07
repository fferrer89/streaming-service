'use client'
import React, { useEffect, useState } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import queries from '@/utils/queries';
import { gql } from '@apollo/client';
import { useMutation, useQuery } from '@apollo/client';
import { useSelector } from 'react-redux';
import { RootState } from '@/utils/redux/store';
import { useRouter } from 'next/navigation';
import { BsSoundwave } from 'react-icons/bs';
import DeleteModal from '@/components/admin/DeleteModal';
import Image from 'next/image';

interface AlbumRef {
  _ref: string;
}

interface Album {
  _id: string;
  type: string;
}

interface Albums {
  _id: string;
  title: string;
  album_type: string;
  total_songs: string;
  release_date: string;
  created_date: string;
  cover_image_url: string;
  visibility: string;
}

const AlbumList: React.FC = () => {
  const router = useRouter();
  const { loggedIn, userType } = useSelector((state: RootState) => state.user);
  const [openModal, setOpenModal] = useState(false);
  const [albumId, setAlbumId] = useState('');
  const [albumTitle, setAlbumTitle] = useState('');
  const { data, loading, error } = useQuery(queries.GET_ALBUMS, { fetchPolicy: 'cache-and-network' });

  const [removeAlbum] = useMutation(queries.REMOVE_ALBUM, {
    update(cache, { data: { removeAlbum } }) {
      cache.modify({
        fields: {
          albums(existingAlbums = []) {
            const newAlbums = existingAlbums.filter((albumRef: AlbumRef) => {
              const album = cache.readFragment<Album>({
                id: albumRef._ref,
                fragment: gql`
                  fragment RemoveAlbum on Album {
                    _id
                    type
                  }
                `,
              });
              return album && album._id !== removeAlbum._id;
            });
            return newAlbums;
          },
        },
      });
    },
    refetchQueries: [{ query: queries.GET_ALBUMS }],
  });

  useEffect(() => {
    document.title = 'Admin - Dashboard | Sounds 54';
  }, []);

  useEffect(() => {
    if (loggedIn && userType === 'user') {
      router.push('/sound');
    } else if (loggedIn && userType === 'artist') {
      router.push('/artist');
    } else if (!loggedIn || userType !== 'admin') {
      router.push('/login/admin');
    }
  }, [loggedIn, router]);

  const handleAlbumDelete = () => {
    removeAlbum({
      variables: {
        id: albumId,
      },
    });

    setOpenModal(false);
  };

  if (!loggedIn || userType !== 'admin') {
    return (
      <div className='text-4xl flex justify-center items-center h-full text-[#22333B] bg-[#C6AC8E]'>
        <span className='mr-2'>Loading</span>
        <span className='animate-bounce'>.</span>
        <span className='animate-bounce delay-75'>.</span>
        <span className='animate-bounce delay-200'>.</span>
      </div>
    );
  }

  const date = (date: string) => {
    date = date.split('T')[0];
    let newDate = date.split('-');
    return `${newDate[1]}-${newDate[2]}-${newDate[0]}`;
  };

  const handleModal = (albumId: string, albumTitle: string) => {
    setAlbumId(albumId);
    setAlbumTitle(albumTitle);
    setOpenModal(true);
  };

  if (loading) {
    return (
      <div className="text-4xl flex justify-center items-center h-full text-[#22333B] bg-[#C6AC8E]">
        <span className="mr-2">Loading</span>
        <span className="animate-bounce">.</span>
        <span className="animate-bounce delay-75">.</span>
        <span className="animate-bounce delay-200">.</span>
      </div>
    );
  }

  if (error) {
    return <div>Error: {error?.message}</div>
  }

  if (data) {
    return (
      <>
        <main className="flex flex-col sm:flex-row bg-[#C6AC8E] min-h-screen w-screen overflow-hidden">
          <AdminSidebar></AdminSidebar>
          <div className='flex flex-col gap-8 py-10 px-6 w-full h-full'>
            <h1 className='text-4xl text-[#22333B]'>Albums</h1>
            <div className='flex flex-col md:flex-wrap md:flex-row gap-6 w-full'>
              {(data.albums.length > 0) ?
                (data.albums.map((album: Albums) => (
                  <div key={album._id} className='flex flex-col sm:w-56 items-center px-3 py-6 rounded-md bg-[#22333B]'>
                    {(album.cover_image_url) ?
                      <Image src={`/file/download/${album.cover_image_url}`} alt='Album Cover' width={100} height={100} className='mb-4 rounded-full' /> :
                      <BsSoundwave className='w-[100px] h-[100px] mb-4 rounded-full' />
                    }
                    <h5 className='mb-2 text-xl font-medium text-[#C6AC8E]'>{album.title}</h5>
                    <span className='text-sm mb-2 text-[#C6AC8E]'>{(album.album_type) ? album.album_type : '--'}</span>
                    <span className='text-sm mb-2 text-[#C6AC8E]'>Songs: {album.total_songs}</span>
                    <span className='text-sm mb-2 text-[#C6AC8E]'>Released: {(album.release_date) ? date(album.release_date) : '--'}</span>
                    <span className='text-sm mb-2 text-[#C6AC8E]'>Created: {(album.created_date) ? date(album.created_date) : '--'}</span>
                    <span className='text-sm text-[#C6AC8E]'>Visibility: {(album.visibility) ? album.visibility : '--'}</span>
                    <button onClick={() => handleModal(album._id, album.title)} className='mt-6 px-4 py-2 text-sm text-white bg-red-700 rounded-md hover:bg-red-800'>Delete</button>
                  </div>
                ))) :
                <p className='text-lg font-bold'>No Data Available</p>
              }
            </div>
          </div>
          {openModal && (
            <DeleteModal
              open={openModal}
              item={`album ${albumTitle}`}
              onClose={() => setOpenModal(false)}
            >
              <div className="flex gap-4">
                <button
                  onClick={handleAlbumDelete}
                  className="w-full mt-6 px-4 py-2 text-sm text-white bg-red-700 rounded-md hover:bg-red-800"
                >
                  Delete
                </button>
                <button
                  className="w-full mt-6 px-4 py-2 text-sm text-white bg-neutral-700 shadow rounded-md hover:bg-neutral-800"
                  onClick={() => setOpenModal(false)}
                >
                  Cancel
                </button>
              </div>
            </DeleteModal>
          )}
        </main>
      </>
    );
  }
};

export default AlbumList;
