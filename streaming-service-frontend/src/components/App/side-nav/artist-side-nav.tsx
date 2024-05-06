"use client";
import React from "react";

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
  return (
    <section className={styles.sideNav}>
      <header>
        <Link href={"/artist/profile"}>
          <Image
            src="/img/ellipse.png"
            width={45}
            height={45}
            alt="Profile image"
          />
        </Link>
      </header>
      <nav>
        <ul>
          <li className="flex items-center hover:bg-stone-500 px-2 py-1 rounded-md">
            <Link href={"/artist"}>
              <Image
                src="/icons/home-white.png"
                width={30}
                height={30}
                alt="Home icon"
              />
            </Link>
            <Link href={"/artist"}>Home</Link>
          </li>
          <li className="flex items-center hover:bg-stone-500 px-2 py-1 rounded-md">
            <Link href={"/artist/search"}>
              <Image
                src="/icons/search-white.png"
                width={30}
                height={30}
                alt="Search icon"
              />
            </Link>
            <Link href={"/artist/search"}>Search</Link>
          </li>
          <li className="flex items-center hover:bg-stone-500 px-2 py-1 rounded-md">
            <div className="flex items-center">
              <Link href="/artist/albums">
                <RiFolderMusicLine size={30} />
              </Link>
              <Link href="/artist/albums">
                <span className="ml-7">Your Albums</span>
              </Link>
            </div>
          </li>
          <li className="flex items-center hover:bg-stone-500 px-2 py-1 rounded-md">
            <div className="flex items-center">
              <Link href="/artist/songs">
                <IoMusicalNotesOutline size={30} />
              </Link>
              <Link href="/artist/songs">
                <span className="ml-7">Your Songs</span>
              </Link>
            </div>
          </li>
        </ul>
      </nav>
    </section>
    //
    //
  );
};

export default ArtistSideNav;
