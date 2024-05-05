'use client'
import React, { useEffect, useState } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import queries from '@/utils/queries';
import { gql } from '@apollo/client';
import { useMutation, useQuery } from '@apollo/client';
import { PiMusicNotesFill } from 'react-icons/pi';
import DeleteModal from '@/components/admin/DeleteModal';

interface SongRef {
  _ref: string;
}

interface Song {
  _id: string;
  type: string;
}

interface Songs {
  _id: string;
  title: string;
  genre: string;
  language: string;
  likes: string;
  release_date: string;
  writtenBy: string;
}

const SongList: React.FC = () => {
  const [openModal, setOpenModal] = useState(false);
  const [songId, setSongId] = useState('');
  const [songTitle, setSongTitle] = useState('');
  const { data, loading, error } = useQuery(queries.GET_SONGS, { fetchPolicy: 'cache-and-network' });
  const [removeSong] = useMutation(queries.REMOVE_SONG, {
    update(cache, { data: { removeSong } }) {
      cache.modify({
        fields: {
          users(existingSongs = []) {
            const newSongs = existingSongs.filter((songRef: SongRef) => {
              const song = cache.readFragment<Song>({
                id: songRef._ref,
                fragment: gql`
                  fragment RemoveSong on Song {
                    _id
                    type
                  }
                `
              });
              return song && song._id !== removeSong._id;
            });
            return newSongs;
          }
        }
      });
    },
    refetchQueries: [{ query: queries.GET_SONGS }]
  });

  const date = (date: string) => {
    date = date.split('T')[0];
    let newDate = date.split('-');
    return `${newDate[1]}-${newDate[2]}-${newDate[0]}`;
  };

  useEffect(() => {
    document.title = 'Dashboard | Sounds 54';
  }, []);

  const handleSongDelete = () => {
    removeSong({
      variables: {
        songId: songId
      }
    });

    setOpenModal(false);
  };

  const handleModal = (songId: string, songTitle: string) => {
    setSongId(songId);
    setSongTitle(songTitle)
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
            <h1 className='text-4xl text-[#22333B]'>Songs</h1>
            <div className='flex flex-col md:flex-wrap md:flex-row gap-6 w-full'>
              {data.songs.map((song: Songs) => (
                <div key={song._id} className='flex flex-col sm:w-56 items-center px-3 py-6 rounded-md bg-[#22333B]'>
                  <PiMusicNotesFill className='w-16 h-16 mb-4' />
                  <h5 className='mb-2 text-xl font-medium text-[#C6AC8E]'>{song.title}</h5>
                  <span className='text-sm mb-2 text-[#C6AC8E]'>Genre: {(song.genre) ? song.genre : '-'}</span>
                  <span className='text-sm mb-2 text-[#C6AC8E]'>Likes: {(song.likes) ? song.likes : '-'}</span>
                  <span className='text-sm mb-2 text-[#C6AC8E]'>Language: {(song.language) ? song.language : '-'}</span>
                  <span className='text-sm mb-2 text-[#C6AC8E]'>Release Date: {(song.release_date) ? date(song.release_date) : '-'}</span>
                  <span className='text-sm text-[#C6AC8E]'>Written By: {(song.writtenBy) ? song.writtenBy : '-'}</span>
                  <button onClick={() => handleModal(song._id, song.title)} className='mt-6 px-4 py-2 text-sm text-white bg-red-700 rounded-md hover:bg-red-800'>Delete</button>
                </div>
              ))}
            </div>
          </div>
          {openModal &&
            <DeleteModal open={openModal} item={`song ${songTitle}`} onClose={() => setOpenModal(false)}>
              <div className='flex gap-4'>
                <button onClick={handleSongDelete} className='w-full mt-6 px-4 py-2 text-sm text-white bg-red-700 rounded-md hover:bg-red-800'>Delete</button>
                <button className='w-full mt-6 px-4 py-2 text-sm text-white bg-neutral-700 shadow rounded-md hover:bg-neutral-800' onClick={() => setOpenModal(false)}>Cancel</button>
              </div>
            </DeleteModal>
          }
        </main>
      </>
    );
  }
}

export default SongList;