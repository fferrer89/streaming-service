import React from 'react';
import SideNav from "@/components/App/side-nav/side-nav";
import Personal from '../Personal';

const Sidebar: React.FC = () => {
    return (
        <div className="flex flex-col gap-2 max-w-lg h-screen p-2 justify-start items-start min-w-lg">
            <SideNav />
            <Personal/>
        </div>
    );
};

export default Sidebar;
