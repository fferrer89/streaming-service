import React from 'react';

const Navbar: React.FC = () => {
  return (
    <nav className=" w-screen flex justify-between p-4 bg-transparent">
      <a href="/explore" className="text-sm font-bold text-[#EAE0D5]">Explore</a>
      <a href="/playlists" className="text-sm font-bold text-[#EAE0D5]">Playlists</a>
      <a href="/support" className="text-sm font-bold text-[#EAE0D5]">Support</a>
    </nav>
  );
};

export default Navbar;

