'use client';
import React from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import Image from 'next/image';
import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';
import { useSelector } from 'react-redux';

const GET_USER_PROFILE_IMAGE = gql`
  query GetUserProfileImage($userId: ID!) {
    getUserById(_id: $userId) {
      profile_image_url
    }
  }
`;

const SideNav: React.FC = () => {
    
    const userId = useSelector((state: { user: { userId: string | null } }) => state.user.userId);


  const { data, loading, error } = useQuery(GET_USER_PROFILE_IMAGE, {
    variables: { userId },
    skip: !userId,
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const profileImageUrl = data?.getUserById?.profile_image_url ;


  return (
    <section className={styles.sideNav}>
      <header>
        <Link href={'/user/profile'}>
          <Image className=' rounded-full border border-white' src={profileImageUrl} width={45} height={45} alt='Profile image' />
        </Link>
      </header>
      <nav>
        <ul>
          <li>
            <Link href={'/'}>
              <Image src='/icons/home-white.png' width={30} height={30} alt='Home icon' />
              Home
            </Link>
          </li>
          <li>
            <Link href={'sound/search'}>
              <Image src='/icons/search-white.png' width={30} height={30} alt='Search icon' />
              Search
            </Link>
          </li>
        </ul>
      </nav>
    </section>
  );
};

export default SideNav;