
"use client";
import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { EDIT_USER_MUTATION, GET_USER_BY_ID } from "@/utils/graphql/queries";
import UserProfileImage from "./UserProfileImage";
import { Separator } from "@/components/ui/separator";

interface UserProfileProps {
  userData: any;
}

const UserProfile: React.FC<UserProfileProps> = ({ userData }) => {
  const date = new Date(userData.getUserById.created_date);
  const formattedDate = date.toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    firstName: userData.getUserById.first_name,
    lastName: userData.getUserById.last_name,
    displayName: userData.getUserById.display_name,
    email: userData.getUserById.email,
    profileImageUrl: userData.getUserById.profile_image_url,
    dateCreated: formattedDate,
    likedSongs: userData.getUserById.liked_songs.length,
  });

  const [editUser] = useMutation(EDIT_USER_MUTATION);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = () => {
    editUser({
      variables: {
        userId: userData.getUserById._id,
        firstName: formData.firstName,
        lastName: formData.lastName,
        displayName: formData.displayName,
        email: formData.email,
        profileImageUrl: formData.profileImageUrl,
      },
      refetchQueries: [{ query: GET_USER_BY_ID, variables: { id: userData.getUserById._id } }],
    }).then(() => {
      setEditMode(false);
    });
  };

  const { firstName, lastName, displayName, email, profileImageUrl, dateCreated, likedSongs } = formData;

  return (
    <div
      className="container mx-auto my-5 p-5 rounded-lg"
      style={{ backgroundColor: "rgba(255, 255, 255, 0.5)" }}
    >
      <div className="md:flex no-wrap md:-mx-2">
        <div className="w-full md:w-3/12 md:mx-2">
          <div className="p-3 border-t-4 border-green-400 bg-stone-300">
            <div className="image overflow-hidden">
              <UserProfileImage image_url={profileImageUrl} size={100} />
            </div>
            <h1 className="text-gray-900 font-bold text-xl leading-8 my-1">{displayName}</h1>
            <h3 className="text-gray-600 font-lg text-semibold leading-6">User</h3>
            <ul className="bg-gray-200 text-gray-600 hover:text-gray-700 hover:shadow py-2 px-3 mt-3 divide-y rounded shadow-sm">
              <li className="flex items-center py-3">
                <span>Liked Songs</span>
                <span className="ml-auto">{likedSongs}</span>
              </li>
              <li className="flex items-center py-3">
                <span>Member since</span>
                <span className="ml-auto">{dateCreated}</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="w-full md:w-9/12 mx-2 h-64">
          <div className="bg-stone-300 p-3 shadow-sm rounded-sm">
            <div className="flex items-center space-x-2 font-semibold text-gray-900 leading-8">
              <span className="text-green-500">
                <svg
                  className="h-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </span>
              <span className="tracking-wide">About</span>
            </div>
            <div className="text-gray-700">
              <div className="grid md:grid-cols-2 text-sm">
                <div className="grid grid-cols-2">
                  <div className="px-4 py-2 font-semibold">First Name</div>
                  {editMode ? (
                    <input
                      className="px-4 py-2 border rounded-md"
                      type="text"
                      name="firstName"
                      value={firstName}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <div className="px-4 py-2">{firstName}</div>
                  )}
                </div>
                <div className="grid grid-cols-2">
                  <div className="px-4 py-2 font-semibold">Last Name</div>
                  {editMode ? (
                    <input
                      className="px-4 py-2 border rounded-md"
                      type="text"
                      name="lastName"
                      value={lastName}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <div className="px-4 py-2">{lastName}</div>
                  )}
                </div>
                <div className="grid grid-cols-2">
                  <div className="px-4 py-2 font-semibold">Email</div>
                  {editMode ? (
                    <input
                      className="px-4 py-2 border rounded-md"
                      type="text"
                      name="email"
                      value={email}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <div className="px-4 py-2">{email}</div>
                  )}
                </div>
                <div className="grid grid-cols-2">
                  <div className="px-4 py-2 font-semibold">Display Name</div>
                  {editMode ? (
                    <input
                      className="px-4 py-2 border rounded-md"
                      type="text"
                      name="displayName"
                      value={displayName}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <div className="px-4 py-2">{displayName}</div>
                  )}
                </div>
                <div className="grid grid-cols-2">
                  <div className="px-4 py-2 font-semibold">Profile Image URL</div>
                  {editMode ? (
                    <input
                      className="px-4 py-2 border rounded-md"
                      type="text"
                      name="profileImageUrl"
                      value={profileImageUrl}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <div className="px-4 py-2">{profileImageUrl}</div>
                  )}
                </div>
              </div>
            </div>
            {editMode ? (
              <button
                onClick={handleSave}
                className="block w-full text-blue-800 text-sm font-semibold rounded-lg hover:bg-gray-100 focus:outline-none focus:shadow-outline focus:bg-gray-100 hover:shadow-xs p-3 my-4"
              >
                Save Changes
              </button>
            ) : (
              <button
                onClick={() => setEditMode(true)}
                className="block w-full text-blue-800 text-sm font-semibold rounded-lg hover:bg-gray-100 focus:outline-none focus:shadow-outline focus:bg-gray-100 hover:shadow-xs p-3 my-4"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
