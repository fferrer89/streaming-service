'use client'
import React, { ReactNode, useEffect } from 'react';
import AdminSidebar from '@/components/admin-sidebar/AdminSidebar';
import queries from '@/utils/queries';
import { useQuery } from '@apollo/client';
import { HiUsers, HiUserGroup } from "react-icons/hi";
import { BsSoundwave } from "react-icons/bs";
import { PiMusicNotesFill } from "react-icons/pi";
import { BsMusicPlayerFill } from "react-icons/bs";
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Legend, Tooltip, Bar } from 'recharts';

let countData = [];

const AdminDashboard: React.FC = () => {
  const { data: adminData, loading: adminLoading, error: adminError } = useQuery(queries.GET_ADMIN);
  const { data, loading, error } = useQuery(queries.GET_COUNT);

  useEffect(() => {
    document.title = 'Dashboard | Sounds 54';
  }, []);

  if (adminLoading || loading) {
    return <div>Loading</div>
  }

  countData = [
    {
      name: 'Users',
      count: data.getUserCount,
      fill: '#0EA5E9'
    },
    {
      name: 'Artists',
      count: data.getArtistCount,
      fill: '#f97316'
    },
    {
      name: 'Albums',
      count: data.getAlbumCount,
      fill: '#22C55E'
    },
    {
      name: 'Songs',
      count: data.getSongCount,
      fill: '#EAb308'
    },
    {
      name: 'Playlists',
      count: data.getPlaylistCount,
      fill: '#EF4444'
    }
  ];

  return (
    <>
      <main className='flex flex-row bg-[#C6AC8E] min-h-screen w-screen overflow-hidden'>
        <AdminSidebar></AdminSidebar>
        <div className='flex flex-col gap-8 py-10 px-6 w-full h-full'>
          <h1 className='text-4xl text-[#22333B]'>
            Welcome {`${adminData.admin[0].first_name} ${adminData.admin[0].last_name}`}&#33;
          </h1>
          <div className='flex flex-col md:flex-wrap md:flex-row gap-2 w-full'>
            <CountWrapper>
              <div className='flex items-center justify-center min-h-12 min-w-12 rounded-full bg-sky-500'>
                <HiUsers className='text-2xl text-white' />
              </div>
              <div className='flex flex-col pl-3'>
                <span className='text-sm text-[#B29B80]'>Total Users</span>
                <span className='text-xl text-center text-white font-semibold'>{data.getUserCount}</span>
              </div>
            </CountWrapper>
            <CountWrapper>
              <div className='flex items-center justify-center min-h-12 min-w-12 rounded-full bg-orange-500'>
                <HiUserGroup className='text-2xl text-white' />
              </div>
              <div className='flex flex-col pl-3'>
                <span className='text-sm text-[#B29B80]'>Total Artists</span>
                <span className='text-xl text-center text-white font-semibold'>{data.getArtistCount}</span>
              </div>
            </CountWrapper>
            <CountWrapper>
              <div className='flex items-center justify-center min-h-12 min-w-12 rounded-full bg-green-500'>
                <BsSoundwave className='text-2xl text-white' />
              </div>
              <div className='flex flex-col pl-3'>
                <span className='text-sm text-[#B29B80]'>Total Albums</span>
                <span className='text-xl text-center text-white font-semibold'>{data.getAlbumCount}</span>
              </div>
            </CountWrapper>
            <CountWrapper>
              <div className='flex items-center justify-center min-h-12 min-w-12 rounded-full bg-yellow-500'>
                <PiMusicNotesFill className='text-2xl text-white' />
              </div>
              <div className='flex flex-col pl-3'>
                <span className='text-sm text-[#B29B80]'>Total Songs</span>
                <span className='text-xl text-center text-white font-semibold'>{data.getSongCount}</span>
              </div>
            </CountWrapper>
            <CountWrapper>
              <div className='flex items-center justify-center min-h-12 min-w-12 rounded-full bg-red-500'>
                <BsMusicPlayerFill className='text-2xl text-white' />
              </div>
              <div className='flex flex-col pl-3'>
                <span className='text-sm text-[#B29B80]'>Total Playlists</span>
                <span className='text-xl text-center text-white font-semibold'>{data.getPlaylistCount}</span>
              </div>
            </CountWrapper>
          </div>
          <div className='h-80 bg-[#22333B] rounded-sm p-4'>
            <span className='text-xl text-[#C6AC8E]'>Total Count Analysis</span>
            <ResponsiveContainer width='100%' height='100%'>
              <BarChart width={500} height={500} data={countData} margin={{ top: 20, right: 30, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray='0' vertical={false} stroke='#C6AC8E' />
                <XAxis dataKey='name' stroke='#C6AC8E' />
                <YAxis stroke='#C6AC8E' />
                <Tooltip />
                <Legend />
                <Bar dataKey='count' fill='#C6AC8E' />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>
    </>
  );
}

interface CountWrapperProps {
  children: ReactNode;
}

const CountWrapper: React.FC<CountWrapperProps> = ({ children }) => {
  return <div className='flex flex-1 min-w-48 items-center py-4 px-4 rounded-sm bg-[#22333B]'>{children}</div>
}

export default AdminDashboard;