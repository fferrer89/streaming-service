'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import Image from 'next/image';
import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';
import { useSelector } from 'react-redux';
import { getImageUrl } from '@/utils/tools/images';

import LogoutButton from '../Artist/LogoutButton';
const GET_USER_PROFILE_IMAGE = gql`
  query GetUserProfileImage($userId: ID!) {
    getUserById(_id: $userId) {
      profile_image_url
    }
  }
`;

const SideNav: React.FC = () => {
    
    const userId = useSelector((state: { user: { userId: string | null } }) => state.user.userId);
    const userType = useSelector((state: { user: { userType: 'user' | 'artist' | 'admin' | null } }) => state.user.userType);

    // const { data, loading, error } = useQuery(GET_USER_PROFILE_IMAGE, {
    //     variables: { userId },
    //     skip: !userId,
    // });

    const [homeRoute, setHomeRoute] = useState('/sound');
    const [searchRoute, setSearchRoute] = useState('/sound/search');
    const [profileImageUrl, setProfileImageUrl] = useState<string>('/img/ellipse.png');

    // useEffect(() => {
    //     const fetchImageUrl = async () => {
    //         if (data?.getUserById?.profile_image_url) {
    //             const resolvedUrl = await getImageUrl(data.getUserById.profile_image_url);
    //             setProfileImageUrl(resolvedUrl);
    //         }
    //     };

    //     fetchImageUrl();
    // }, [data]);

    useEffect(() => {
        const determineRoutes = () => {
            switch (userType) {
                case 'artist':
                    setHomeRoute('/artist/dashboard');
                    setSearchRoute('/artist/search');
                    break;
                case 'user':
                case 'admin':
                default:
                    setHomeRoute('/sound');
                    setSearchRoute('/sound/search');
                    break;
            }
        };

        determineRoutes();
    }, [userType]);

    // if (loading) {
    //     return <div>Loading...</div>;
    // }

    // if (error) {
    //     return <div>Error: {error.message}</div>;
    // }

    
   

    return (
        <section className="p-2.5 bg-[rgba(255,255,255,0.2)] text-white w-full rounded-2xl">
            <header className="flex flex-row items-center justify-between w-full">
                <Link href={'/sound/soundProfile'}>
                    <Image className='rounded-full border border-white' src={ profileImageUrl} width={45} height={45} alt='Profile image' />
                </Link>
                <LogoutButton />
            </header>
            <nav>
                <ul>
                    <li className="hover:bg-stone-500 px-2 py-1 rounded-md my-2.5 px-1.5 py-3.5">
                        <Link href={homeRoute}>
                            <div className="flex items-center">
                                <Image src='/icons/home-white.png' width={30} height={30} alt='Home icon' className="inline-block mr-6" />
                                <span className="ml-2">Home</span>
                            </div>
                        </Link>
                    </li>
                    <li className="hover:bg-stone-500 px-2 py-1 rounded-md my-2.5 px-1.5 py-3.5">
                        <Link href={searchRoute}>
                            <div className="flex items-center">
                                <Image src='/icons/search-white.png' width={30} height={30} alt='Search icon' className="inline-block mr-6" />
                                <span className="ml-2">Search</span>
                            </div>
                        </Link>
                    </li>
                </ul>
            </nav>
        </section>
    );
};

export default SideNav;
