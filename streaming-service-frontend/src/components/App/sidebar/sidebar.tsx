import React from 'react';
import SideNav from "@/components/App/side-nav/side-nav";
import Personal from '../Personal';

const Sidebar: React.FC = () => {
    return (
        <div className="flex flex-col gap-2 w-[350px] h-full p-2 justify-start items-start ">
            <SideNav />
            <Personal/>
        </div>
    );
};

export default Sidebar;
