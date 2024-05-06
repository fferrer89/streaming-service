'use client'
import React, { useEffect, useState } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import queries from '@/utils/queries';
import { gql } from '@apollo/client';
import { useMutation, useQuery } from '@apollo/client';
import { useSelector } from 'react-redux';
import { RootState } from '@/utils/redux/store';
import { useRouter } from 'next/navigation';
import { FaUserAlt } from 'react-icons/fa';
import DeleteModal from '@/components/admin/DeleteModal';
import Image from 'next/image';

interface UserRef {
  _ref: string;
}

interface User {
  _id: string;
  type: string;
}

interface Users {
  _id: string;
  display_name: string;
  first_name: string;
  last_name: string;
  email: string;
  gender: string;
  profile_image_url: string;
  date_of_birth: string;
}

const UserList: React.FC = () => {
  const router = useRouter();
  const { loggedIn, userType } = useSelector((state: RootState) => state.user);
  const [openModal, setOpenModal] = useState(false);
  const [userId, setUserId] = useState('');
  const [userName, setUserName] = useState('');
  const { data, loading, error } = useQuery(queries.GET_USERS, { fetchPolicy: 'cache-and-network' });

  const [removeUser] = useMutation(queries.REMOVE_USER, {
    update(cache, { data: { removeUser } }) {
      cache.modify({
        fields: {
          users(existingUsers = []) {
            const newUsers = existingUsers.filter((userRef: UserRef) => {
              const user = cache.readFragment<User>({
                id: userRef._ref,
                fragment: gql`
                  fragment RemoveUser on User {
                    _id
                    type
                  }
                `
              });
              return user && user._id !== removeUser._id;
            });
            return newUsers;
          }
        }
      });
    },
    refetchQueries: [{ query: queries.GET_USERS }]
  });

  useEffect(() => {
    document.title = 'Admin - Dashboard | Sounds 54';
  }, []);

  useEffect(() => {
    if (loggedIn && userType === 'user') {
      router.push('/sound');
    } else if (loggedIn && userType === 'artist') {
      router.push('/artist');
    } else if (!loggedIn || userType !== 'admin') {
      router.push('/login/admin');
    }
  }, [loggedIn, router]);

  const handleUserDelete = () => {
    removeUser({
      variables: {
        userId: userId
      }
    });

    setOpenModal(false);
  };

  if (!loggedIn || userType !== 'admin') {
    return (
      <div className='text-4xl flex justify-center items-center h-full text-[#22333B] bg-[#C6AC8E]'>
        <span className='mr-2'>Loading</span>
        <span className='animate-bounce'>.</span>
        <span className='animate-bounce delay-75'>.</span>
        <span className='animate-bounce delay-200'>.</span>
      </div>
    );
  }

  const handleModal = (userId: string, userName: string) => {
    setUserId(userId);
    setUserName(userName)
    setOpenModal(true);
  };

  if (loading) {
    return (
      <div className='text-4xl flex justify-center items-center h-full text-[#22333B] bg-[#C6AC8E]'>
        <span className='mr-2'>Loading</span>
        <span className='animate-bounce'>.</span>
        <span className='animate-bounce delay-75'>.</span>
        <span className='animate-bounce delay-200'>.</span>
      </div>
    );
  }

  if (error) {
    return <div>Error: {error?.message}</div>
  }

  if (data) {
    return (
      <>
        <main className='flex flex-col sm:flex-row bg-[#C6AC8E] min-h-screen w-screen overflow-hidden'>
          <AdminSidebar></AdminSidebar>
          <div className='flex flex-col gap-8 py-10 px-6 w-full h-full'>
            <h1 className='text-4xl text-[#22333B]'>Users</h1>
            <div className='flex flex-col md:flex-wrap md:flex-row gap-6 w-full'>
              {(data.users.length > 0) ?
                (data.users.map((user: Users) => (
                  <div key={user._id} className='flex flex-col sm:w-56 items-center px-3 py-6 rounded-md bg-[#22333B]'>
                    {(user.profile_image_url) ?
                      <Image src={`/file/download/${user.profile_image_url}`} alt='User Profile' width={100} height={100} className='mb-4 rounded-full' /> :
                      <FaUserAlt className='w-[100px] h-[100px] mb-4 rounded-full' />
                    }
                    <h5 className='mb-2 text-xl font-medium text-[#C6AC8E]'>{user.display_name}</h5>
                    <span className='text-sm mb-2 text-[#C6AC8E]'>Name: {`${user.first_name} ${user.last_name}`}</span>
                    <span className='text-sm mb-2 text-[#C6AC8E]'>Email: {user.email}</span>
                    <span className='text-sm mb-2 text-[#C6AC8E]'>Gender: {(user.gender) ? user.gender : '--'}</span>
                    <span className='text-sm text-[#C6AC8E]'>DOB: {(user.date_of_birth) ? user.date_of_birth : '--'}</span>
                    <button onClick={() => handleModal(user._id, `${user.first_name} ${user.last_name}`)} className='mt-6 px-4 py-2 text-sm text-white bg-red-700 rounded-md hover:bg-red-800'>Delete</button>
                  </div>
                ))) :
                <p className='text-lg font-bold'>No Data Available</p>
              }
            </div>
          </div>
          {openModal &&
            <DeleteModal open={openModal} item={`user ${userName}`} onClose={() => setOpenModal(false)}>
              <div className='flex gap-4'>
                <button onClick={handleUserDelete} className='w-full mt-6 px-4 py-2 text-sm text-white bg-red-700 rounded-md hover:bg-red-800'>Delete</button>
                <button className='w-full mt-6 px-4 py-2 text-sm text-white bg-neutral-700 shadow rounded-md hover:bg-neutral-800' onClick={() => setOpenModal(false)}>Cancel</button>
              </div>
            </DeleteModal>
          }
        </main>
      </>
    );
  }
}

export default UserList;