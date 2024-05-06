import { gql } from "@apollo/client";


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
        cover_image_url
      }
      song_url
      title
      writtenBy
      cover_image_url
      artists {
        display_name
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
  }
`;
