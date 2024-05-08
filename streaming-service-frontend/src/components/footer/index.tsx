"use client";
import React from "react";

const Footer: React.FC = () => {
  return (
    <div
      className="py-[50px] px-[50px]"
      style={{ backgroundColor: "#C6AC8E", width: "100vw" }}
    >
      <div className="w-full flex items-center justify-between">
        <p className="text-[#22333B] text-[20px] font-bold">© 2024 Sounds 54</p>
        <div className="flex items-center justify-center ">
          <a className=" text-[#22333B] justify-between font-mono border-2 text-2xl border-[#C6AC8E] px-5 py-1  w-full flex  rounded-full mb-auto mt-10">
            <span>A Music Streaming Platform</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Footer;
