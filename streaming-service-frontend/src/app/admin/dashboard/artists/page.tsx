'use client'
import React, { useEffect, useState } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import queries from '@/utils/queries';
import { gql } from '@apollo/client';
import { useMutation, useQuery } from '@apollo/client';
import { useSelector } from 'react-redux';
import { RootState } from '@/utils/redux/store';
import { useRouter } from 'next/navigation';
import { FaUser } from 'react-icons/fa6';
import DeleteModal from '@/components/admin/DeleteModal';
import Image from 'next/image';

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
  date_of_birth: string;
  profile_image_url: string;
}

const PAGE_SIZE = 10;

const AdminDashboardArtists: React.FC = () => {
  const router = useRouter();
  const { loggedIn, userType } = useSelector((state: RootState) => state.user);
  const [openModal, setOpenModal] = useState(false);
  const [artistId, setArtistId] = useState('');
  const [artistName, setArtistName] = useState('');
  const { data, loading, error } = useQuery(queries.GET_DASHBOARD_ARTISTS, { fetchPolicy: 'cache-and-network' });
  const [currentPage, setCurrentPage] = useState(1);

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
    refetchQueries: [{ query: queries.GET_DASHBOARD_ARTISTS }]
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

  const handleArtistDelete = () => {
    removeArtist({
      variables: {
        artistId: artistId
      }
    });

    setOpenModal(false);
  };

  if (loading || !loggedIn || userType !== 'admin') {
    return (
      <div className='text-4xl flex justify-center items-center h-full text-[#22333B] bg-[#C6AC8E]'>
        <span className='mr-2'>Loading</span>
        <span className='animate-bounce'>.</span>
        <span className='animate-bounce delay-75'>.</span>
        <span className='animate-bounce delay-200'>.</span>
      </div>
    );
  }


  const handleModal = (artistId: string, artistName: string) => {
    setArtistId(artistId);
    setArtistName(artistName)
    setOpenModal(true);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const paginatedArtists = data.artists.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  if (data) {
    return (
      <>
        <main className='flex flex-col sm:flex-row bg-[#C6AC8E] min-h-screen w-screen overflow-hidden'>
          <AdminSidebar></AdminSidebar>
          <div className='flex flex-col gap-8 py-10 px-6 w-full h-full sm:ml-60'>
            <div className='flex justify-between items-center'>
              <h1 className='text-4xl text-[#22333B]'>Artists</h1>
              <div className="inline-flex gap-4">
                <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}
                  className="bg-transparent hover:bg-[#22333B] text-[#22333B] font-semibold hover:text-[#C6AC8E] py-2 px-4 border border-[#22333B] hover:border-transparent rounded"
                >Prev</button>
                <button onClick={() => handlePageChange(currentPage + 1)} disabled={data.artists.length / PAGE_SIZE <= currentPage}
                  className="bg-transparent hover:bg-[#22333B] text-[#22333B] font-semibold hover:text-[#C6AC8E] py-2 px-4 border border-[#22333B] hover:border-transparent rounded"
                >Next</button>
              </div>
            </div>
            <div className='flex flex-col md:flex-wrap md:flex-row gap-4 w-full'>
              {(paginatedArtists.length > 0) ?
                (paginatedArtists.map((artist: Artists) => (
                  <div key={artist._id} className='flex flex-col sm:w-56 items-center justify-center text-center px-3 py-6 rounded-md bg-[#22333B]'>
                    {(artist.profile_image_url) ?
                      <Image src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/file/download/${artist.profile_image_url}`} alt='Artist Profile' width={100} height={100} className='mb-4 rounded-full' /> :
                      <FaUser className='w-[100px] h-[100px] mb-4 rounded-full' />
                    }
                    <h5 className='mb-2 text-xl font-medium text-[#C6AC8E] w-full break-words'>{artist.display_name}</h5>
                    <span className='text-md text-[#C6AC8E] font-semibold'>Name</span>
                    <span className='text-sm mb-2 text-[#C6AC8E]'>{`${artist.first_name} ${artist.last_name}`}</span>
                    <span className='text-md text-[#C6AC8E] font-semibold'>Email</span>
                    <span className='text-sm mb-2 text-[#C6AC8E] w-full break-words'>{artist.email}</span>
                    <span className='text-md text-[#C6AC8E] font-semibold'>Gender</span>
                    <span className='text-sm mb-2 text-[#C6AC8E]'>Gender: {(artist.gender) ? artist.gender : '--'}</span>
                    <span className='text-md text-[#C6AC8E] font-semibold'>DOB</span>
                    <span className='text-sm text-[#C6AC8E]'>{(artist.date_of_birth) ? artist.date_of_birth : '--'}</span>
                    <button onClick={() => handleModal(artist._id, `${artist.first_name} ${artist.last_name}`)} className='mt-6 px-4 py-2 text-sm text-white bg-red-700 rounded-md hover:bg-red-800'>Delete</button>
                  </div>
                ))) :
                <p className='text-lg font-bold'>No Data Available</p>
              }
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

export default AdminDashboardArtists;