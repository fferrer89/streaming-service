"use client";
import React, { useEffect, useState } from "react";
import LogoutButton from "../Artist/LogoutButton";
import Link from "next/link";
import styles from "./page.module.css";
import Image from "next/image";
import { IoMusicalNotesOutline } from "react-icons/io5";
import { RiFolderMusicLine } from "react-icons/ri";

const ArtistSideNav: React.FC = () => {
  /**
   * TODO: pull info from currently playing song
   * This state contains the information of the currently playing song
   */
  const [sideNavStyle, setSideNavStyle] = useState<string>("");

  useEffect(() => {
    setSideNavStyle(styles.sideNav); // Set the style after component mounts
  }, []);

  return (
    <section className="p-2.5 bg-[rgba(255,255,255,0.2)] text-white w-full rounded-2xl">
      <header className="flex flex-row items-center justify-between w-full">
        <Link href={"/artist/profile"}>
          <Image
            src="/img/ellipse.png"
            width={45}
            height={45}
            alt="Profile image"
            className="inline-block mr-6"
          />
        </Link>
        <LogoutButton />
      </header>
      <nav>
        <ul>
          <li className="hover:bg-stone-500 px-2 py-1 rounded-md my-2.5 px-1.5 py-3.5">
            <Link href={"/artist"}>
              <div className="flex items-center">
                <Image
                  src="/icons/home-white.png"
                  width={30}
                  height={30}
                  alt="Home icon"
                  className="inline-block mr-6"
                />
                <span className="ml-2">Home</span>
              </div>
            </Link>
          </li>
          <li className="hover:bg-stone-500 px-2 py-1 rounded-md my-2.5 px-1.5 py-3.5">
            <Link href={"/artist/search"}>
              <div className="flex items-center">
                <Image
                  src="/icons/search-white.png"
                  width={30}
                  height={30}
                  alt="Search icon"
                  className="inline-block mr-6"
                />
                <span className="ml-2">Search</span>
              </div>
            </Link>
          </li>
          <li className="hover:bg-stone-500 px-2 py-1 rounded-md my-2.5 px-1.5 py-3.5">
            <Link href="/artist/albums">
              <div className="flex items-center">
                <RiFolderMusicLine size={30}  />
                <span className="ml-8">Your Albums</span>
              </div>
            </Link>
          </li>
          <li className="hover:bg-stone-500 px-2 py-1 rounded-md my-2.5 px-1.5 py-3.5">
            <Link href="/artist/songs">
              <div className="flex items-center">
                <IoMusicalNotesOutline size={30} />
                <span className="ml-8">Your Songs</span>
              </div>
            </Link>
          </li>
        </ul>
      </nav>
    </section>
    //
    //
  );
};

export default ArtistSideNav;
