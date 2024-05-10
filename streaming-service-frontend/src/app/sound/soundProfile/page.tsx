"use client";
import React from "react";
import { useQuery } from "@apollo/client";
import {GET_USER_BY_ID} from "@/utils/graphql/queries";
import { useSelector } from "react-redux";

const SoundProfilePage: React.FC<{ params: { id: string } }> = ({ params }) => {
  const userId = useSelector(
    (state: { user: { userId: string | null } }) => state.user.userId
  );
  const {
    data: user,
    loading,
    error,
  } = useQuery(GET_USER_BY_ID, {
    variables: { id: userId },
  });

  if (loading) {
    return <div>Loading</div>;
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="container mx-auto my-5 p-5 rounded-lg">
      <div className="md:flex no-wrap md:-mx-2">
        <div className="w-full md:w-3/12 md:mx-2">
          <div className="p-3 border-t-4 border-green-400 bg-stone-300">
            <div className="image overflow-hidden">
              <img src={user.getUserById.profile_image_url || "/img/profile-placeholder.png"} alt="Profile" className="h-24 w-24 rounded-full" />
            </div>
            <h1 className="text-gray-900 font-bold text-xl leading-8 my-1">
              {user.getUserById.display_name}
            </h1>
            <h3 className="text-gray-600 font-lg text-semibold leading-6">
              User
            </h3>
            <ul className="bg-gray-200 text-gray-600 hover:text-gray-700 hover:shadow py-2 px-3 mt-3 divide-y rounded shadow-sm">
              <li className="flex items-center py-3">
                <span>Email</span>
                <span className="ml-auto">{user.getUserById.email}</span>
              </li>
              <li className="flex items-center py-3">
                <span>Full Name</span>
                <span className="ml-auto">{user.getUserById.first_name} {user.getUserById.last_name}</span>
              </li>
              <li className="flex items-center py-3">
                <span>Gender</span>
                <span className="ml-auto">{user.getUserById.gender}</span>
              </li>
              <li className="flex items-center py-3">
                <span>Date of Birth</span>
                <span className="ml-auto">{user.getUserById.date_of_birth}</span>
              </li>
              <li className="flex items-center py-3">
                <span>Account Created</span>
                <span className="ml-auto">{new Date(user.getUserById.created_date).toLocaleDateString()}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SoundProfilePage;