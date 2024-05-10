'use client'
import React from 'react'
import Link from 'next/link';
import { FcBullish } from 'react-icons/fc';
import { HiOutlineViewGrid, HiUsers, HiUserGroup, HiOutlineLogout } from 'react-icons/hi';
import { BsSoundwave } from 'react-icons/bs';
import { PiMusicNotesFill } from 'react-icons/pi';
import { usePathname } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { logout } from '@/utils/redux/features/user/userSlice';
import Cookies from 'js-cookie';

const AdminSideBar: React.FC = () => {
  const pathname = usePathname();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    Cookies.remove('token');
    Cookies.remove('userType');
  };

  return (
    <div className='flex flex-col min-w-60 px-4 py-2 bg-[#22333B] sm:fixed sm:h-full sm:z-10 sm:top-0 sm:left-0'>
      <div className='flex items-center justify-center gap-4 px-1 py-3'>
        <FcBullish fontSize={35} />
        <span className='text-2xl mt-2 text-[#C6AC8E]'>Sounds 54</span>
      </div>
      <div className='flex flex-col flex-1 gap-1 py-8 text-[#C6AC8E]'>
        <Link href='/admin/dashboard' className={`flex items-center gap-4 text-lg px-3 py-2 rounded-sm hover:bg-[#38474F] hover:text-[#D7C5B0] ${pathname === '/admin/dashboard' ? 'text-[#d7c5b0] bg-[#38474F]' : ''}`}>
          <HiOutlineViewGrid fontSize={24} />
          <span className='text-sm'>Dashboard</span>
        </Link>
        <Link href='/admin/dashboard/users' className={`flex items-center gap-4 text-lg px-3 py-2 rounded-sm hover:bg-[#38474F] hover:text-[#D7C5B0] ${pathname === '/admin/dashboard/users' ? 'text-[#d7c5b0] bg-[#38474F]' : ''}`}>
          <HiUsers fontSize={24} />
          <span className='text-sm'>Users</span>
        </Link>
        <Link href='/admin/dashboard/artists' className={`flex items-center gap-4 text-lg px-3 py-2 rounded-sm hover:bg-[#38474F] hover:text-[#D7C5B0] ${pathname === '/admin/dashboard/artists' ? 'text-[#d7c5b0] bg-[#38474F]' : ''}`}>
          <HiUserGroup fontSize={24} />
          <span className='text-sm'>Artists</span>
        </Link>
        <Link href='/admin/dashboard/albums' className={`flex items-center gap-4 text-lg px-3 py-2 rounded-sm hover:bg-[#38474F] hover:text-[#D7C5B0] ${pathname === '/admin/dashboard/albums' ? 'text-[#d7c5b0] bg-[#38474F]' : ''}`}>
          <BsSoundwave fontSize={24} />
          <span className='text-sm'>Albums</span>
        </Link>
        <Link href='/admin/dashboard/songs' className={`flex items-center gap-4 text-lg px-3 py-2 rounded-sm hover:bg-[#38474F] hover:text-[#D7C5B0] ${pathname === '/admin/dashboard/songs' ? 'text-[#d7c5b0] bg-[#38474F]' : ''}`}>
          <PiMusicNotesFill fontSize={24} />
          <span className='text-sm'>Songs</span>
        </Link>
      </div>
      <div className='border-t-2 border-zinc-600'>
        <div onClick={handleLogout} className='flex items-center gap-4 text-lg px-3 py-2 rounded-sm hover:bg-[#38474F] hover:text-[#D7C5B0] cursor-pointer'>
          <HiOutlineLogout fontSize={24} color='#dc2626' />
          <span className='text-base text-red-600'>Log out</span>
        </div>
      </div>
    </div>
  );
}

export default AdminSideBar;