'use client'
import React, { useEffect } from 'react';
import AdminSidebar from '@/components/admin-sidebar/AdminSidebar';
import queries from '@/utils/queries';
import { gql } from "@apollo/client";
import { useMutation, useQuery } from '@apollo/client';
import { FaUserAlt } from 'react-icons/fa';

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
}

const UserList: React.FC = () => {
  const { data, loading, error } = useQuery(queries.GET_USERS);
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
    document.title = 'Dashboard | Sounds 54';
  }, []);

  const handleUserDelete = (userId: string) => {
    removeUser({
      variables: {
        userId: userId
      }
    });
  };

  if (loading) {
    return <div>Loading</div>
  }

  return (
    <>
      <main className='flex flex-row bg-[#C6AC8E] min-h-screen w-screen overflow-hidden'>
        <AdminSidebar></AdminSidebar>
        <div className='flex flex-col gap-8 py-10 px-6 w-full h-full'>
          <h1 className='text-4xl text-[#22333B]'>Users</h1>
          <div className='flex flex-col md:flex-wrap md:flex-row gap-2 w-full'>
            {data.users.map((user: Users) => (
              <div key={user._id} className='flex flex-col sm:w-60 items-center px-5 py-10 rounded-md bg-[#22333B]'>
                <FaUserAlt className='w-24 h-24 mb-4 rounded-full' />
                <h5 className='mb-2 text-xl font-medium text-[#C6AC8E]'>{user.display_name}</h5>
                <span className='text-sm mb-2 text-[#C6AC8E]'>{`${user.first_name} ${user.last_name}`}</span>
                <span className='text-sm mb-2 text-[#C6AC8E]'>{user.email}</span>
                <span className='text-sm text-[#C6AC8E]'>{user.gender}</span>
                <button onClick={() => handleUserDelete(user._id)} className='mt-6 px-4 py-2 text-sm text-white bg-red-700 rounded-md hover:bg-red-800'>Delete</button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}

export default UserList;