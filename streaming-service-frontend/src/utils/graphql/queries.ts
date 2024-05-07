import { gql } from "@apollo/client";

// getNewlyReleasedAlbums
// getMostLikedAlbums
// getNewlyReleasedSongs
// getMostLikedPlaylists
export const FeedQuery = gql`
  query Feed {
    getMostLikedSongs {
      _id
      duration
      genre
      language
      likes
      lyrics
      producers
      release_date
      album {
        _id 
        title
        cover_image_url
      }
      song_url
      title
      writtenBy
      cover_image_url
      artists {
        _id
        display_name
        profile_image_url
      }
    }
    getMostFollowedArtists {
      created_date
      date_of_birth
      _id
      display_name
      email
      first_name
      gender
      genres
      last_name
      profile_image_url
    }
    getNewlyReleasedAlbums {
      _id
      album_type
      artists {
        display_name
        profile_image_url
        last_name
      }
      cover_image_url
      total_songs
      songs {
        _id
      }
      description
      created_date
      title
    }
    getMostLikedAlbums {
      _id
      album_type
      artists {
        display_name
        profile_image_url
        last_name
      }
      cover_image_url
      total_songs
      songs {
        _id
      }
      description
      created_date
      title
    }
    getNewlyReleasedSongs {
      _id
      duration
      genre
      language
      likes
      lyrics
      producers
      release_date
      album {
        _id 
        title
        cover_image_url
      }
      song_url
      title
      writtenBy
      cover_image_url
      artists {
        _id
        display_name
        profile_image_url
      }
    }
  }
`;


export const GetUserLikedSongs = gql`
query GetUserLikedSongs($userId: String!) {
  getUserLikedSongs(userId: $userId) {
    _id 
    title 
    duration 
    song_url 
    writtenBy 
    producers 
    language 
    genre 
    lyrics 
    release_date 
    album {
        _id 
        title 
        cover_image_url 
    } 
    artists {
        _id 
        display_name 
        profile_image_url 
    } 
  }
}
`;

export const GetUserPlaylists = gql`
  query GetUserPlaylists($userId: ID!) {
    getPlaylistsByOwner(userId: $userId) {
      _id
      description
      title
    }
  }
`;