"use client";
import React from "react";
import { gql, useQuery } from "@apollo/client";

const GET_ARTISTS = gql`
  query query {
    artists {
      _id
    }
  }
`;

const ArtistsPage: React.FC = () => {
  const { loading, error, data } = useQuery(GET_ARTISTS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h1>Artists</h1>
      <ul>
        {data.artists.map((artist: { _id: string; name: string }) => (
          <li>{artist._id}</li>
        ))}
      </ul>
    </div>
  );
};

export default ArtistsPage;
