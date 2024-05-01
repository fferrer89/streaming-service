import React from 'react';
import SideNav from "@/components/App/side-nav/side-nav";
import Personal from '../Personal';

const Sidebar: React.FC = () => {
    return (
        <div className="grid gap-[0.2rem] items-start max-w-[400px] h-screen p-2">
            <SideNav />
            <Personal/>
        </div>
    );
};

export default Sidebar;
