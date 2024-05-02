'use client';
import React, { ReactNode } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../utils/redux/store';
import { login } from '../../utils/redux/features/user/userSlice';
import Sidebar from '@/components/App/sidebar/sidebar';
 

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({children}) => {
    const dispatch = useDispatch();
    const { loggedIn } = useSelector((state: RootState) => state.user);

    const LoginButton: React.FC = () => {
        return (
            <button onClick={() => dispatch(login(true))}>Log in</button>
        );
    };

    return (
        <div className="flex h-full items-start justify-start">
            {loggedIn ? (
                <>
                  <div className="w-fit h-full block top-0 left-0 z-50">
                    <Sidebar />
                  </div>
                  <main className="flex-grow h-full flex items-start justify-start z-50 py-2 pr-2">
                    {children}
                  </main>
                </>
            ) : <LoginButton />}
        </div>
    );
};

export default Layout;
