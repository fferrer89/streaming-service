'use client'
import React, { useEffect, useState } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import queries from '@/utils/queries';
import { gql } from '@apollo/client';
import { useMutation, useQuery } from '@apollo/client';
import { FaUser } from 'react-icons/fa6';
import DeleteModal from '@/components/admin/DeleteModal';

interface ArtistRef {
  _ref: string;
}

interface Artist {
  _id: string;
  type: string
}

interface Artists {
  _id: string;
  display_name: string;
  first_name: string;
  last_name: string;
  email: string;
  gender: string;
}

const ArtistList: React.FC = () => {
  const [openModal, setOpenModal] = useState(false);
  const [artistId, setArtistId] = useState('');
  const [artistName, setArtistName] = useState('');
  const { data, loading, error } = useQuery(queries.GET_ARTISTS, { fetchPolicy: 'cache-and-network' });
  const [removeArtist] = useMutation(queries.REMOVE_ARTIST, {
    update(cache, { data: { removeArtist } }) {
      cache.modify({
        fields: {
          users(existingArtists = []) {
            const newArtists = existingArtists.filter((artistRef: ArtistRef) => {
              const artist = cache.readFragment<Artist>({
                id: artistRef._ref,
                fragment: gql`
                  fragment RemoveArtist on Artist {
                    _id
                    type
                  }
                `
              });
              return artist && artist._id !== removeArtist._id;
            });
            return newArtists;
          }
        }
      });
    },
    refetchQueries: [{ query: queries.GET_ARTISTS }]
  });

  useEffect(() => {
    document.title = 'Dashboard | Sounds 54';
  }, []);

  const handleArtistDelete = () => {
    removeArtist({
      variables: {
        artistId: artistId
      }
    });

    setOpenModal(false);
  };

  const handleModal = (artistId: string, artistName: string) => {
    setArtistId(artistId);
    setArtistName(artistName)
    setOpenModal(true);
  };

  if (loading) {
    return (
      <div className='text-4xl flex justify-center items-center h-full text-[#22333B] bg-[#C6AC8E]'>
        <span className='mr-2'>Loading</span>
        <span className='animate-bounce'>.</span>
        <span className='animate-bounce delay-75'>.</span>
        <span className='animate-bounce delay-200'>.</span>
      </div>
    );
  }

  if (data) {
    return (
      <>
        <main className='flex flex-col sm:flex-row bg-[#C6AC8E] min-h-screen w-screen overflow-hidden'>
          <AdminSidebar></AdminSidebar>
          <div className='flex flex-col gap-8 py-10 px-6 w-full h-full'>
            <h1 className='text-4xl text-[#22333B]'>Artists</h1>
            <div className='flex flex-col md:flex-wrap md:flex-row gap-6 w-full'>
              {data.artists.map((artist: Artists) => (
                <div key={artist._id} className='flex flex-col sm:w-56 items-center px-3 py-6 rounded-md bg-[#22333B]'>
                  <FaUser className='w-16 h-16 mb-4 rounded-full' />
                  <h5 className='mb-2 text-xl font-medium text-[#C6AC8E]'>{artist.display_name}</h5>
                  <span className='text-sm mb-2 text-[#C6AC8E]'>{`${artist.first_name} ${artist.last_name}`}</span>
                  <span className='text-sm mb-2 text-[#C6AC8E]'>{artist.email}</span>
                  <span className='text-sm text-[#C6AC8E]'>{artist.gender}</span>
                  <button onClick={() => handleModal(artist._id, `${artist.first_name} ${artist.last_name}`)} className='mt-6 px-4 py-2 text-sm text-white bg-red-700 rounded-md hover:bg-red-800'>Delete</button>
                </div>
              ))}
            </div>
          </div>
          {openModal &&
            <DeleteModal open={openModal} item={`artist ${artistName}`} onClose={() => setOpenModal(false)}>
              <div className='flex gap-4'>
                <button onClick={handleArtistDelete} className='w-full mt-6 px-4 py-2 text-sm text-white bg-red-700 rounded-md hover:bg-red-800'>Delete</button>
                <button className='w-full mt-6 px-4 py-2 text-sm text-white bg-neutral-700 shadow rounded-md hover:bg-neutral-800' onClick={() => setOpenModal(false)}>Cancel</button>
              </div>
            </DeleteModal>
          }
        </main>
      </>
    );
  }
}

export default ArtistList;