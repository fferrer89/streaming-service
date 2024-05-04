'use client'
import React from 'react';


import Link from "next/link";
import styles from "./page.module.css";
import Image from "next/image";
const SideNav: React.FC = () => {
    /**
     * TODO: pull info from currently playing song
     * This state contains the information of the currently playing song
     */
    return (
        <section className={styles.sideNav}>
            <header>
                <Link href={'/user/profile'}>
                    <Image
                        src='/img/ellipse.png'
                        width={45}
                        height={45}
                        alt='Profile image'
                    />
                </Link>
       
            </header>
            <nav>
                <ul>
                    <li>
                        <Link href={'/'}>
                            <Image
                                src='/icons/home-white.png'
                                width={30}
                                height={30}
                                alt='Home icon'
                            />
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link href={'sound/search'}>
                            <Image
                                src='/icons/search-white.png'
                                width={30}
                                height={30}
                                alt='Search icon'
                            />
                            Search
                        </Link>
                    </li>
                </ul>
            </nav>

        </section>
        //
        //

    );
};

export default SideNav;