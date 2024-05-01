import { gql } from '@apollo/client';

const REGISTER_USER = gql`
  mutation registerUser($firstName: String!, $lastName: String!, $displayName: String!, $email: String!, $password: String!, $profileImageUrl: String!) {
    registerUser(first_name: $firstName, last_name: $lastName, display_name: $displayName, email: $email, password: $password, profile_image_url: $profileImageUrl) {
      user {
        _id
      }
    }
  }
`;

const REGISTER_ARTIST = gql`
  mutation registerArtist($firstName: String!, $lastName: String!, $displayName: String!, $email: String!, $password: String!, $profileImageUrl: String!, $genres: [MusicGenre!]!) {
    registerArtist(first_name: $firstName, last_name: $lastName, display_name: $displayName, email: $email, password: $password, profile_image_url: $profileImageUrl, genres: $genres) {
      artist {
        _id
      }
    }
  }
`;

let queries = {
  REGISTER_USER,
  REGISTER_ARTIST
};

export default queries;