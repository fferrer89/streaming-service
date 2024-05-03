'use client'
import React, { useEffect } from 'react';
import queries from '@/utils/queries';
import { useQuery } from '@apollo/client';
import AdminSidebar from '@/components/admin-sidebar/AdminSidebar.jsx';
import { FaUser } from "react-icons/fa6";

export default function ArtistList() {
  const { data, loading, error } = useQuery(queries.GET_ARTISTS);

  useEffect(() => {
    document.title = 'Dashboard | Sounds 54';
  }, []);

  if (loading) {
    return <div>Loading</div>
  }

  return (
    <>
      <main className='flex flex-row bg-[#C6AC8E] min-h-screen w-screen overflow-hidden'>
        <AdminSidebar></AdminSidebar>
        <div className='flex flex-col gap-8 py-10 px-6 w-full h-full'>
          <h1 className='text-4xl text-[#22333B]'>Artists</h1>
          <div className='flex flex-col md:flex-wrap md:flex-row gap-2 w-full'>
            {data.artists.map((artist) => (
              <div key={artist._id} className="flex flex-col sm:w-60 items-center px-5 py-10 rounded-md bg-[#22333B]">
                <FaUser className="w-24 h-24 mb-4 rounded-full" />
                <h5 className="mb-2 text-xl font-medium text-[#C6AC8E]">{artist.display_name}</h5>
                <span className="text-sm mb-2 text-[#C6AC8E]">{`${artist.first_name} ${artist.last_name}`}</span>
                <span className="text-sm mb-2 text-[#C6AC8E]">{artist.email}</span>
                <span className="text-sm text-[#C6AC8E]">{artist.gender}</span>
                <div className="flex mt-4 md:mt-6">
                  <a href="#" className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-red-700 rounded-lg hover:bg-red-800">Delete</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
