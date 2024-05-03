'use client'
import React, { useEffect } from 'react';
import queries from '@/utils/queries';
import { useMutation, useQuery } from '@apollo/client';
import AdminSidebar from '@/components/admin-sidebar/AdminSidebar.jsx';
import { BsSoundwave } from 'react-icons/bs';
import { gql } from "@apollo/client";

export default function AlbumList() {
  const { data, loading, error } = useQuery(queries.GET_ALBUMS);
  const [removeAlbum] = useMutation(queries.REMOVE_ALBUM, {
    update(cache, { data: { removeAlbum } }) {
      cache.modify({
        fields: {
          albums(existingAlbums = []) {
            const newAlbums = existingAlbums.filter(albumRef => {
              const album = cache.readFragment({
                _id: albumRef._ref,
                fragment: gql`
                  fragment RemoveAlbum on Album {
                    _id
                    type
                  }
                `
              });
              return album._id !== removeAlbum._id;
            });
            return newAlbums;
          }
        }
      });
    },
    refetchQueries: [{ query: queries.GET_ALBUMS }]
  });

  const date = (date) => {
    date = date.split('T')[0];
    date = date.split('-');
    date = `${date[1]}-${date[2]}-${date[0]}`;
    return date;
  };

  useEffect(() => {
    document.title = 'Dashboard | Sounds 54';
  }, []);

  const handleAlbumDelete = (albumId) => {
    removeAlbum({
      variables: {
        id: albumId
      }
    });
  };

  if (loading) {
    return <div>Loading</div>
  }

  return (
    <>
      <main className='flex flex-row bg-[#C6AC8E] min-h-screen w-screen overflow-hidden'>
        <AdminSidebar></AdminSidebar>
        <div className='flex flex-col gap-8 py-10 px-6 w-full h-full'>
          <h1 className='text-4xl text-[#22333B]'>Albums</h1>
          <div className='flex flex-col md:flex-wrap md:flex-row gap-2 w-full'>
            {data.albums.map((album) => (
              <div key={album._id} className='flex flex-col sm:w-60 items-center px-5 py-10 rounded-md bg-[#22333B]'>
                <BsSoundwave className='w-24 h-24 mb-4 rounded-full' />
                <h5 className='mb-2 text-xl font-medium text-[#C6AC8E]'>{album.title}</h5>
                <span className='text-sm mb-2 text-[#C6AC8E]'>{album.album_type}</span>
                <span className='text-sm mb-2 text-[#C6AC8E]'>Songs: {album.total_songs}</span>
                <span className='text-sm mb-2 text-[#C6AC8E]'>Release: {date(album.release_date)}</span>
                <span className='text-sm text-[#C6AC8E]'>Created: {date(album.created_date)}</span>
                <button onClick={() => handleAlbumDelete(album._id)} className='mt-6 px-4 py-2 text-sm text-white bg-red-700 rounded-md hover:bg-red-800'>Delete</button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
