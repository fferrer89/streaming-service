import React, { ReactNode } from 'react';
import Sidebar from '@/components/App/sidebar/sidebar';
import 'tailwindcss/tailwind.css';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({children}) => {
    return (
        <div className="flex h-screen">
            <div className="w-full h-full block top-0 left-0 z-50">
                <Sidebar />
            </div>
            <main className="w-full h-full  block top-0 right-0 opacity-75 z-50">
                {children}
            </main>
        </div>
    );
};

export default Layout;
