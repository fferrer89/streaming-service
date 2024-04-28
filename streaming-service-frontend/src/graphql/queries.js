import { gql } from "@apollo/client";

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
`;

let exported = {
  GET_ARTISTS,
  GET_ALBUMS,
  GET_SONGS,
  GET_PLAYLISTS_BY_OWNER,
};

export default exported;
