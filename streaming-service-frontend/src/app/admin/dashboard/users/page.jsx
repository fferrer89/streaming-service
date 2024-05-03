'use client'
import React, { useEffect } from 'react';
import queries from '@/utils/queries';
import { useQuery } from '@apollo/client';
import AdminSidebar from '@/components/admin-sidebar/AdminSidebar.jsx';
import { FaUserAlt } from 'react-icons/fa';

export default function UserList() {
  const { data, loading, error } = useQuery(queries.GET_USERS);

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
          <h1 className='text-4xl text-[#22333B]'>Users</h1>
          <div className='flex flex-col md:flex-wrap md:flex-row gap-2 w-full'>
            {data.users.map((user) => (
              <div key={user._id} className='flex flex-col sm:w-60 items-center px-5 py-10 rounded-md bg-[#22333B]'>
                <FaUserAlt className='w-24 h-24 mb-4 rounded-full' />
                <h5 className='mb-2 text-xl font-medium text-[#C6AC8E]'>{user.display_name}</h5>
                <span className='text-sm mb-2 text-[#C6AC8E]'>{`${user.first_name} ${user.last_name}`}</span>
                <span className='text-sm mb-2 text-[#C6AC8E]'>{user.email}</span>
                <span className='text-sm text-[#C6AC8E]'>{user.gender}</span>
                <button className='mt-6 px-4 py-2 text-sm text-white bg-red-700 rounded-md hover:bg-red-800'>Delete</button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}