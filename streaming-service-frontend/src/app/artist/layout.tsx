'use client';
import React, { ReactNode, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/utils/redux/store';
import ArtistSidebar from '@/components/App/sidebar/artistSidebar';
import SPlayer from '@/components/views/dashboard/footer-player';
import { useRouter } from 'next/navigation';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { loggedIn } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (!loggedIn) {
      router.push('/login');
    }
  }, [loggedIn, router]);

  if (!loggedIn) {
    return null;
  }

  return (
    <div className="flex flex-col h-screen items-start justify-start">
      <div className="flex flex-row h-full w-full">
        <div className="w-fit h-full block top-0 left-0 z-50">
          <ArtistSidebar />
        </div>
        <main className="flex-grow h-full w-full flex items-start justify-start z-50 py-2 pr-2">
          {children}
          <SPlayer />
        </main>
      </div>
    </div>
  );
};

export default Layout;
