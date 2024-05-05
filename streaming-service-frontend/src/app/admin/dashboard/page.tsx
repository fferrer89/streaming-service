'use client'
import React, { ReactNode, useEffect } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import queries from '@/utils/queries';
import { useQuery } from '@apollo/client';
import { HiUsers, HiUserGroup } from 'react-icons/hi';
import { BsSoundwave } from 'react-icons/bs';
import { PiMusicNotesFill } from 'react-icons/pi';
import { BsMusicPlayerFill } from 'react-icons/bs';
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Legend, Tooltip, Bar, PieChart, Pie, Cell } from 'recharts';

interface User {
  gender: string;
}

interface Artist {
  gender: string;
}

interface Song {
  language: string;
}

interface CustomLabel {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
  index: number;
}

let countData = [];
let userGenderData = [];
let artistGenderData = [];
let songLanguageData = [];

const COLORS = ['#0EA5E9', '#22C55E', '#EF4444'];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: CustomLabel) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill='white' textAnchor={x > cx ? 'start' : 'end'} dominantBaseline='central'>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const AdminDashboard: React.FC = () => {
  const { data: adminData, loading: adminLoading, error: adminError } = useQuery(queries.GET_ADMIN, { fetchPolicy: 'cache-and-network' });
  const { data, loading, error } = useQuery(queries.GET_COUNT, { fetchPolicy: 'cache-and-network' });
  const { data: userData, loading: userLoading, error: userError } = useQuery(queries.GET_USERS, { fetchPolicy: 'cache-and-network' })
  const { data: artistData, loading: artistLoading, error: artistError } = useQuery(queries.GET_ARTISTS, { fetchPolicy: 'cache-and-network' })
  const { data: songData, loading: songLoading, error: songError } = useQuery(queries.GET_SONGS, { fetchPolicy: 'cache-and-network' });

  useEffect(() => {
    document.title = 'Dashboard | Sounds 54';
  }, []);

  if (adminLoading || loading || userLoading || artistLoading || songLoading) {
    return (
      <div className='text-4xl flex justify-center items-center h-full text-[#22333B] bg-[#C6AC8E]'>
        <span className='mr-2'>Loading</span>
        <span className='animate-bounce'>.</span>
        <span className='animate-bounce delay-75'>.</span>
        <span className='animate-bounce delay-200'>.</span>
      </div>
    );
  }

  if (data && adminData && userData && artistData && songData) {
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
  
    let userFemaleCount = 0;
    let userMaleCount = 0;
    let userOtherCount = 0;
    userData.users.forEach((user: User) => {
      if (user.gender) {
        if (user.gender.toLowerCase() === 'female') {
          userFemaleCount++;
        } else if (user.gender.toLowerCase() === 'male') {
          userMaleCount++;
        } else {
          userOtherCount++;
        }
      }
    });
  
    userGenderData = [
      { name: 'Female', value: userFemaleCount },
      { name: 'Male', value: userMaleCount },
      { name: 'Other', value: userOtherCount }
    ];
  
    let artistFemaleCount = 0;
    let artistMaleCount = 0;
    let artistOtherCount = 0;
    artistData.artists.forEach((artist: Artist) => {
      if (artist.gender) {
        if (artist.gender.toLowerCase() === 'female') {
          artistFemaleCount++;
        } else if (artist.gender.toLowerCase() === 'male') {
          artistMaleCount++;
        } else {
          artistOtherCount++;
        }
      }
    });
  
    artistGenderData = [
      { name: 'Female', value: artistFemaleCount },
      { name: 'Male', value: artistMaleCount },
      { name: 'Other', value: artistOtherCount }
    ];
  
    let songEnglishCount = 0;
    let songOtherCount = 0;
    songData.songs.forEach((song: Song) => {
      if (song.language) {
        if (song.language.toLowerCase() === 'english') {
          songEnglishCount++;
        } else {
          songOtherCount++;
        }
      }
    });
  
    songLanguageData = [
      { name: 'English', value: songEnglishCount },
      { name: 'Other', value: songOtherCount }
    ];
    
    return (
      <>
        <main className='flex flex-col sm:flex-row bg-[#C6AC8E] min-h-screen w-screen overflow-hidden'>
          <AdminSidebar></AdminSidebar>
          <div className='flex flex-col gap-8 py-10 px-6 w-full h-full'>
            <h1 className='text-4xl text-[#22333B]'>
              Welcome {`${adminData.admin[0].first_name} ${adminData.admin[0].last_name}`}&#33;
            </h1>
            <div className='flex flex-col md:flex-wrap md:flex-row gap-2 w-full'>
              <CountWrapper>
                <div className='flex items-center justify-center min-h-10 min-w-10 rounded-full bg-sky-500'>
                  <HiUsers className='text-xl text-white' />
                </div>
                <div className='flex flex-col pl-8 sm:pl-3'>
                  <span className='text-sm text-[#B29B80]'>Total Users</span>
                  <span className='text-xl text-center text-white font-semibold'>{data.getUserCount}</span>
                </div>
              </CountWrapper>
              <CountWrapper>
                <div className='flex items-center justify-center min-h-10 min-w-10 rounded-full bg-orange-500'>
                  <HiUserGroup className='text-2xl text-white' />
                </div>
                <div className='flex flex-col pl-8 sm:pl-3'>
                  <span className='text-sm text-[#B29B80]'>Total Artists</span>
                  <span className='text-xl text-center text-white font-semibold'>{data.getArtistCount}</span>
                </div>
              </CountWrapper>
              <CountWrapper>
                <div className='flex items-center justify-center min-h-10 min-w-10 rounded-full bg-green-500'>
                  <BsSoundwave className='text-2xl text-white' />
                </div>
                <div className='flex flex-col pl-8 sm:pl-3'>
                  <span className='text-sm text-[#B29B80]'>Total Albums</span>
                  <span className='text-xl text-center text-white font-semibold'>{data.getAlbumCount}</span>
                </div>
              </CountWrapper>
              <CountWrapper>
                <div className='flex items-center justify-center min-h-10 min-w-10 rounded-full bg-yellow-500'>
                  <PiMusicNotesFill className='text-2xl text-white' />
                </div>
                <div className='flex flex-col pl-8 sm:pl-3'>
                  <span className='text-sm text-[#B29B80]'>Total Songs</span>
                  <span className='text-xl text-center text-white font-semibold'>{data.getSongCount}</span>
                </div>
              </CountWrapper>
              <CountWrapper>
                <div className='flex items-center justify-center min-h-10 min-w-10 rounded-full bg-red-500'>
                  <BsMusicPlayerFill className='text-xl text-white' />
                </div>
                <div className='flex flex-col pl-8 sm:pl-3'>
                  <span className='text-sm text-[#B29B80]'>Total Playlists</span>
                  <span className='text-xl text-center text-white font-semibold'>{data.getPlaylistCount}</span>
                </div>
              </CountWrapper>
            </div>
            <div className='h-80 bg-[#22333B] rounded-sm p-4'>
              <span className='text-lg text-[#C6AC8E]'>Total Count Analysis</span>
              <ResponsiveContainer width='100%' height='100%'>
                <BarChart width={500} height={500} data={countData} margin={{ top: 30, right: 20, left: -20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray='0' vertical={false} stroke='#C6AC8E' />
                  <XAxis dataKey='name' stroke='#C6AC8E' />
                  <YAxis stroke='#C6AC8E' />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey='count' fill='#C6AC8E' barSize={80} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className='flex flex-col items-center sm:flex-row sm:gap-x-4 gap-y-4 justify-evenly'>
              <div className='flex flex-col p-4 w-[20rem] h-[20rem] rounded-sm bg-[#22333B]'>
                <span className='text-lg pt-4 text-[#C6AC8E]'>User Profile</span>
                <ResponsiveContainer width='100%' height='100%'>
                  <PieChart width={400} height={400}>
                    <Pie
                      data={userGenderData}
                      cx='50%'
                      cy='50%'
                      labelLine={false}
                      label={renderCustomizedLabel}
                      outerRadius={100}
                      fill='#8884d8'
                      dataKey='value'
                    >
                      {userGenderData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className='flex flex-col p-4 w-[20rem] h-[20rem] rounded-sm bg-[#22333B]'>
                <span className='text-lg pt-4 text-[#C6AC8E]'>Artist Profile</span>
                <ResponsiveContainer width='100%' height='100%'>
                  <PieChart width={400} height={400}>
                    <Pie
                      data={artistGenderData}
                      cx='50%'
                      cy='50%'
                      labelLine={false}
                      label={renderCustomizedLabel}
                      outerRadius={100}
                      fill='#8884d8'
                      dataKey='value'
                    >
                      {artistGenderData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className='flex flex-col p-4 w-[20rem] h-[20rem] rounded-sm bg-[#22333B]'>
                <span className='text-lg pt-4 text-[#C6AC8E]'>Songs Language</span>
                <ResponsiveContainer width='100%' height='100%'>
                  <PieChart width={400} height={400}>
                    <Pie
                      data={songLanguageData}
                      cx='50%'
                      cy='50%'
                      labelLine={false}
                      label={renderCustomizedLabel}
                      outerRadius={100}
                      fill='#8884d8'
                      dataKey='value'
                    >
                      {songLanguageData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={['#EAb308', '#EF4444'][index % 2]} />
                      ))}
                    </Pie>
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </main>
      </>
    );
  }
}

interface CountWrapperProps {
  children: ReactNode;
}

const CountWrapper: React.FC<CountWrapperProps> = ({ children }) => {
  return <div className='flex flex-1 items-center min-w-48 py-3 pl-8 sm:pl-4 rounded-sm bg-[#22333B]'>{children}</div>
}

export default AdminDashboard;