import React, { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { useMutation } from "@apollo/client";
import queries from "@/utils/queries";
import ArtistProfileImage from "./ArtistProfileImage";

const ArtistProfile: React.FC<{ artistData: any }> = ({ artistData }) => {
  const date = new Date(artistData.getArtistById.created_date);
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  const formattedDate = date.toLocaleString("en-US");

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    firstName: artistData.getArtistById.first_name,
    lastName: artistData.getArtistById.last_name,
    displayName: artistData.getArtistById.display_name,
    email: artistData.getArtistById.email,
    genres: artistData.getArtistById.genres.join(", "),
    dateCreated: formattedDate,
    followersCount:
      artistData.getArtistById.followers.users.length +
      artistData.getArtistById.followers.artists.length,
    followingCount:
      artistData.getArtistById.following.users.length +
      artistData.getArtistById.following.artists.length,
  });

  const [editArtist] = useMutation(queries.EDIT_ARTIST);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = () => {
    editArtist({
      variables: {
        artistId: artistData.getArtistById._id,
        ...formData,
      },
    }).then(() => {
      setEditMode(false);
    });
  };

  const { firstName, lastName, displayName, email, genres } = formData;

  const imageUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/file/download/${artistData.getArtistById.profile_image_url}`;

  return (
    <div className="container mx-auto my-5 p-5 rounded-lg">
      <div className="md:flex no-wrap md:-mx-2">
        <div className="w-full md:w-3/12 md:mx-2 ">
          <div className="p-3 border-t-4 border-green-400 bg-stone-300">
            <div className="image overflow-hidden">
              <ArtistProfileImage
                image_url={artistData.getArtistById.profile_image_url}
                size={100}
              />
            </div>
            <h1 className="text-gray-900 font-bold text-xl leading-8 my-1">
              {displayName}
            </h1>
            <h3 className="text-gray-600 font-lg text-semibold leading-6">
              Artist
            </h3>
            <ul className="bg-gray-200 text-gray-600 hover:text-gray-700 hover:shadow py-2 px-3 mt-3 divide-y rounded shadow-sm">
              <li className="flex items-center py-3">
                <span>Followers</span>
                <span className="ml-auto">{formData.followersCount}</span>
              </li>
              <li className="flex items-center py-3">
                <span>Following</span>
                <span className="ml-auto">{formData.followingCount}</span>
              </li>
              <li className="flex items-center py-3">
                <span>Status</span>
                <span className="ml-auto">
                  <span className="bg-green-500 py-1 px-2 rounded text-white text-sm">
                    Active
                  </span>
                </span>
              </li>
              <li className="flex items-center py-3">
                <span>Member since</span>
                <span className="ml-auto">{formData.dateCreated}</span>
              </li>
            </ul>
          </div>
          <div className="my-4"></div>
          <div className="bg-stone-300 p-3 hover:shadow">
            <div className="flex items-center space-x-3 font-semibold text-gray-900 text-xl leading-8">
              <span className="text-green-500">
                <svg
                  className="h-5 fill-current"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </span>
              <span>Followers</span>
            </div>
            <div className="grid grid-cols-3">
              {artistData.getArtistById.followers.artists.map((artist: any) => (
                <div
                  key={artist._id}
                  className="flex items-center justify-center my-2 ml-8"
                >
                  <ArtistProfileImage image_url={null} size={50} />
                  <a href="#" className="ml-4">
                    {artist.display_name}
                  </a>
                </div>
              ))}
            </div>
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
                  <div className="px-4 py-2">{firstName}</div>
                </div>
                <div className="grid grid-cols-2">
                  <div className="px-4 py-2 font-semibold">Last Name</div>
                  <div className="px-4 py-2">{lastName}</div>
                </div>
                <div className="grid grid-cols-2">
                  <div className="px-4 py-2 font-semibold">Email</div>
                  <div className="px-4 py-2">{email}</div>
                </div>
                <div className="grid grid-cols-2">
                  <div className="px-4 py-2 font-semibold">Genres</div>
                  <div className="px-4 py-2">{genres}</div>
                </div>
              </div>
            </div>
            {editMode && (
              <button
                onClick={handleSave}
                className="block w-full text-blue-800 text-sm font-semibold rounded-lg hover:bg-gray-100 focus:outline-none focus:shadow-outline focus:bg-gray-100 hover:shadow-xs p-3 my-4"
              >
                Save Changes
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtistProfile;
