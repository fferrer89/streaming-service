"use client";
import React from "react";
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
        <LogoutButton />
      </header>
      <nav>
        <ul>
          <li className="hover:bg-stone-500 px-2 py-1 rounded-md">
            <Link href={"/artist"}>
              <div className="flex items-center">
                <Image
                  src="/icons/home-white.png"
                  width={30}
                  height={30}
                  alt="Home icon"
                />
                <span className="ml-2">Home</span>
              </div>
            </Link>
          </li>
          <li className="hover:bg-stone-500 px-2 py-1 rounded-md">
            <Link href={"/artist/search"}>
              <div className="flex items-center">
                <Image
                  src="/icons/search-white.png"
                  width={30}
                  height={30}
                  alt="Search icon"
                />
                <span className="ml-2">Search</span>
              </div>
            </Link>
          </li>
          <li className="hover:bg-stone-500 px-2 py-1 rounded-md">
            <Link href="/artist/albums">
              <div className="flex items-center">
                <RiFolderMusicLine size={30} />
                <span className="ml-2">Your Albums</span>
              </div>
            </Link>
          </li>
          <li className="hover:bg-stone-500 px-2 py-1 rounded-md">
            <Link href="/artist/songs">
              <div className="flex items-center">
                <IoMusicalNotesOutline size={30} />
                <span className="ml-2">Your Songs</span>
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
