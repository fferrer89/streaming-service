import { gql } from "@apollo/client";

const REGISTER_USER = gql`
  mutation registerUser(
    $firstName: String!
    $lastName: String!
    $displayName: String!
    $email: String!
    $password: String!
    $profileImageUrl: String!
  ) {
    registerUser(
      first_name: $firstName
      last_name: $lastName
      display_name: $displayName
      email: $email
      password: $password
      profile_image_url: $profileImageUrl
    ) {
      user {
        _id
      }
    }
  }
`;

const REGISTER_ARTIST = gql`
  mutation registerArtist(
    $firstName: String!
    $lastName: String!
    $displayName: String!
    $email: String!
    $password: String!
    $profileImageUrl: String!
    $genres: [MusicGenre!]!
  ) {
    registerArtist(
      first_name: $firstName
      last_name: $lastName
      display_name: $displayName
      email: $email
      password: $password
      profile_image_url: $profileImageUrl
      genres: $genres
    ) {
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

const GET_USERS = gql`
  query users {
    users {
      _id
      created_date
      date_of_birth
      display_name
      email
      first_name
      gender
      last_name
      liked_songs {
        liked_date
        songId
      }
      password_changed_date
      profile_image_url
    }
  }
`;

const GET_ARTISTS = gql`
  query query {
    artists {
      _id
      created_date
      date_of_birth
      display_name
      email
      first_name
      gender
      genres
      last_name
      profile_image_url
    }
  }
`;

const GET_ALBUMS = gql`
  query query {
    albums {
      _id
      album_type
      cover_image_url
      created_date
      description
      genres
      last_updated
      likes
      release_date
      songs {
        _id
        title
      }
      title
      total_duration
      total_songs
      visibility
      artists {
        _id
        display_name
      }
    }
  }
`;

const GET_SONGS = gql`
  query query {
    songs {
      _id
      album {
        _id
        title
      }
      artists {
        _id
        display_name
      }
      cover_image_url
      duration
      genre
      language
      likes
      lyrics
      producers
      release_date
      song_url
      title
      writtenBy
    }
  }
`;

const GET_PLAYLISTS_BY_OWNER = gql`
  query query {
    getPlaylistsByOwner(userId: $userId) {
      _id
      created_date
      description
      likes
      owner {
        _id
        display_name
      }
      songs {
        _id
        title
      }
      title
      visibility
    }
  }
`

const GET_COUNT = gql`
  query getCount {
    getUserCount
    getArtistCount
    getAlbumCount
    getSongCount
    getPlaylistCount
  }
`;

const GET_ADMIN = gql`
  query admin {
    admin {
      _id
      first_name
      last_name
      email
    }
  }
`;

const REMOVE_USER = gql`
  mutation removeUser($userId: ID!) {
    removeUser(userId: $userId) {
      _id
    }
  }
`;

const REMOVE_ARTIST = gql`
  mutation removeArtist($artistId: ID!) {
    removeArtist(artistId: $artistId) {
      _id
    }
  }
`;

const REMOVE_ALBUM = gql`
  mutation removeAlbum($id: ID!) {
    removeAlbum(_id: $id) {
      _id
    }
  }
`;

const REMOVE_SONG = gql`
  mutation removeSong($songId: ID!) {
    removeSong(songId: $songId) {
      _id
    }
  }
`;

const REMOVE_PLAYLIST = gql`
  mutation removePlaylist($playlistId: ID!) {
    removePlaylist(playlistId: $playlistId) {
      _id
    }
  }
`;

const queries = {
  REGISTER_USER,
  REGISTER_ARTIST,
  LOGIN_ADMIN,
  LOGIN_USER,
  LOGIN_ARTIST,
  GET_ADMIN,
  GET_USERS,
  GET_ARTISTS,
  GET_ALBUMS,
  GET_SONGS,
  GET_PLAYLISTS_BY_OWNER,
  GET_COUNT,
  REMOVE_USER,
  REMOVE_ARTIST,
  REMOVE_ALBUM,
  REMOVE_SONG,
  REMOVE_PLAYLIST
};

export default queries;
