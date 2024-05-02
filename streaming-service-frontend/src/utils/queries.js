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

const LOGIN_ADMIN = gql`
  mutation loginAdmin($email: String!, $password: String!) {
    loginAdmin(email: $email, password: $password) {
      admin {
        _id
      }
      token
    }
  }
`;

const LOGIN_USER = gql`
  mutation loginUser($email: String!, $password: String!) {
    loginUser(email: $email, password: $password) {
      user {
        _id
      }
      token
    }
  }
`;

const LOGIN_ARTIST = gql`
  mutation loginArtist($email: String!, $password: String!) {
    loginArtist(email: $email, password: $password) {
      artist {
        _id
      }
      token
    }
  }
`;

const queries = {
  REGISTER_USER,
  REGISTER_ARTIST,
  LOGIN_ADMIN,
  LOGIN_USER,
  LOGIN_ARTIST
};

export default queries;