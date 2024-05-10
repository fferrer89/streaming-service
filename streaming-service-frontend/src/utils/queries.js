import { gql } from "@apollo/client";

const REGISTER_USER = gql`
  mutation registerUser(
    $firstName: String!
    $lastName: String!
    $displayName: String!
    $email: String!
    $password: String!
  ) {
    registerUser(
      first_name: $firstName
      last_name: $lastName
      display_name: $displayName
      email: $email
      password: $password
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
    $genres: [MusicGenre!]!
  ) {
    registerArtist(
      first_name: $firstName
      last_name: $lastName
      display_name: $displayName
      email: $email
      password: $password
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
  query query($userId: userId) {
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
const GET_ARTIST_BY_ID = gql`
  query query($id: ID!) {
    getArtistById(_id: $id) {
      _id
      created_date
      date_of_birth
      display_name
      email
      first_name
      followers {
        artists {
          _id
          display_name
        }
        users {
          _id
          display_name
        }
      }
      following {
        artists {
          display_name
          _id
        }
        users {
          _id
          display_name
        }
      }
      gender
      genres
      last_name
      display_name
    }
  }
`;

const GET_ALBUMS_BY_ARTIST = gql`
  query query($artistId: ID!) {
    getAlbumsByArtist(artistId: $artistId) {
      _id
      title
      album_type
      description
      release_date
      visibility
      cover_image_url
      genres
      songs {
        _id
      }
    }
  }
`;

const GET_DASHBOARD_DATA = gql`
  query getDashboardData {
    admin: admin {
      first_name
      last_name
    },
    users: users {
      gender
    },
    artists: artists {
      gender
    },
    albums: albums {
      album_type
    },
    songs: songs {
      language
    },
    mostLikedSongs: getMostLikedSongs {
      _id
      title
      writtenBy
      release_date
      likes
      genre
      cover_image_url
    },
    getUserCount
    getArtistCount
    getAlbumCount
    getSongCount
    getPlaylistCount
  }
`;

const GET_DASHBOARD_USERS = gql`
  query users {
    users {
      _id
      display_name
      first_name
      last_name
      email
      gender
      date_of_birth
      profile_image_url
    }
  }
`;

const GET_DASHBOARD_ARTISTS = gql`
  query artists {
    artists {
      _id
      display_name
      first_name
      last_name
      email
      gender
      date_of_birth
      profile_image_url
    }
  }
`;

const GET_DASHBOARD_SONGS = gql`
  query songs {
    songs {
      _id
      title
      genre
      likes
      language
      release_date
      writtenBy
      cover_image_url
    }
  }
`;

const GET_DASHBOARD_ALBUMS = gql`
  query albums {
    albums {
      _id
      title
      album_type
      total_songs
      release_date
      created_date
      visibility
      cover_image_url
    }
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
const ADD_ALBUM = gql`
  mutation AddAlbum(
    $album_type: AlbumType!
    $title: String!
    $cover_image_url: ID
    $description: String!
    $release_date: Date!
    $genres: [MusicGenre!]!
    $visibility: Visibility!
    $artists: [ID!]
    $songs: [ID]
  ) {
    addAlbum(
      album_type: $album_type
      title: $title
      cover_image_url: $cover_image_url
      description: $description
      release_date: $release_date
      genres: $genres
      visibility: $visibility
      artists: $artists
      songs: $songs
    ) {
      _id
      album_type
      total_songs
      cover_image_url
      title
      description
      release_date
      created_date
      last_updated
      artists {
        _id
        display_name
      }
      songs {
        _id
        title
      }
      genres
      likes
      total_duration
      visibility
    }
  }
`;
const EDIT_ALBUM = gql`
  mutation editAlbum(
    $_id: ID!
    $title: String
    $album_type: AlbumType
    $cover_image_url: ID
    $description: String
    $release_date: Date
    $visibility: Visibility
    $genres: [MusicGenre!]
  ) {
    editAlbum(
      _id: $_id
      title: $title
      album_type: $album_type
      cover_image_url: $cover_image_url
      description: $description
      release_date: $release_date
      visibility: $visibility
      genres: $genres
    ) {
      _id
    }
  }
`;

const GET_ALBUM_BY_ID = gql`
  query query($id: ID!) {
    getAlbumById(_id: $id) {
      _id
      album_type
      artists {
        _id
        display_name
        profile_image_url
      }
      cover_image_url
      created_date
      description
      genres
      last_updated
      liked_by {
        artists
        users
      }
      likes
      release_date
      songs {
        _id
        title
        cover_image_url
      }
      title
      total_duration
      visibility
      total_songs
      likes
    }
  }
`;

const GET_SONGS_BY_ARTIST = gql`
  query query($artistId: String!) {
    getSongsByArtistID(artistId: $artistId) {
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

const GET_SONG_BY_ID = gql`
  query query($id: ID!) {
    getSongById(_id: $id) {
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
const ADD_SONG = gql`
  mutation addSong(
    $title: String!
    $duration: Int
    $song_url: ID!
    $cover_image_url: ID!
    $writtenBy: String!
    $producers: [String!]!
    $genre: MusicGenre!
    $release_date: Date!
    $artists: [ID!]!
    $lyrics: String
    $album: ID
  ) {
    addSong(
      title: $title
      duration: $duration
      song_url: $song_url
      cover_image_url: $cover_image_url
      writtenBy: $writtenBy
      producers: $producers
      genre: $genre
      release_date: $release_date
      artists: $artists
      lyrics: $lyrics
      album: $album
    ) {
      _id
    }
  }
`;
const EDIT_SONG = gql`
  mutation editSong(
    $songId: ID!
    $title: String
    $duration: Int
    $song_url: ID
    $cover_image_url: ID
    $writtenBy: String
    $producers: [String!]
    $genre: MusicGenre
    $release_date: Date
    $artists: [ID!]
  ) {
    editSong(
      songId: $songId
      title: $title
      duration: $duration
      song_url: $song_url
      cover_image_url: $cover_image_url
      writtenBy: $writtenBy
      producers: $producers
      genre: $genre
      release_date: $release_date
      artists: $artists
    ) {
      _id
    }
  }
`;

const TOGGLE_PLAYLIST = gql`
  mutation ToggleLikePlaylist($playlistId: ID!) {
    toggleLikePlaylist(playlistId: $playlistId) {
      likes
    }
  }
`;

const GET_PLAYLIST = gql`
  query GetPlaylistById($id: ID!) {
    getPlaylistById(_id: $id) {
      visibility
      isOwner
      songs {
        _id 
        title 
        duration 
        song_url 
        writtenBy 
        producers 
        language 
        genre 
        lyrics 
        likes
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
      description
      owner {
          first_name
          display_name
      }
      created_date
      _id
      title
      likes
      isLiked
     
    }
  }
`;

const EDIT_PLAYLIST = gql`
  mutation EditPlaylist(
    $title: String
    $description: String
    $visibility: String
    $playlistId: ID!
  ) {
    editPlaylist(
      title: $title
      description: $description
      visibility: $visibility
      playlistId: $playlistId
    ) {
      _id
      title
    }
  }
`;

const CREATE_PLAYLIST = gql`
  mutation CreatePlaylist(
    $description: String!
    $title: String!
    $visibility: String!
  ) {
    createPlaylist(
      description: $description
      title: $title
      visibility: $visibility
    ) {
      _id
      title
    }
  }
`;

const EDIT_ARTIST = gql`
  mutation mutation(
    $artistId: ID!
    $firstName: String
    $lastName: String
    $displayName: String
    $email: String
    $password: String
    $genres: [MusicGenre]
  ) {
    editArtist(
      artistId: $artistId
      first_name: $firstName
      last_name: $lastName
      display_name: $displayName
      email: $email
      password: $password
      genres: $genres
    ) {
      _id
      created_date
      date_of_birth
      display_name
      email
      first_name
      gender
      genres
      last_name
      password_changed_date
      profile_image_url
    }
  }
`;

const GET_SONG_BY_TITLE = gql`
  query GetSongsByTitle($searchTerm: String!) {
    getSongsByTitle(searchTerm: $searchTerm) {
      _id
      title
      artists {
        first_name
        last_name
      }
    }
  }
`;

const ADD_SONG_TO_PLAYLIST = gql`
  mutation AddSongToPlaylist($playlistId: ID!, $songId: ID!) {
    addSongToPlaylist(playlistId: $playlistId, songId: $songId) {
      _id
    }
  }
`;

const REMOVE_SONG_FROM_ALBUM = gql`
  mutation RemoveSongFromAlbum($id: ID!, $songId: ID!) {
    removeSongFromAlbum(_id: $id, songId: $songId) {
      _id
      title
    }
  }
`;

const REMOVE_ARTIST_FROM_ALBUM = gql`
  mutation RemoveArtistFromAlbum($id: ID!, $artistId: ID!) {
    removeArtistFromAlbum(_id: $id, artistId: $artistId) {
      _id
      title
    }
  }
`;

const REMOVE_SONG_FROM_PLAYLIST = gql`
  mutation RemoveSongFromPlaylist($playlistId: ID!, $songId: ID!) {
    removeSongFromPlaylist(playlistId: $playlistId, songId: $songId) {
      _id
    }
  }
`;

const ADD_SONG_TO_ALBUM = gql`
  mutation AddSongToAlbum($id: ID!, $songId: ID!) {
    addSongToAlbum(_id: $id, songId: $songId) {
      _id
      title
    }
  }
`;

const ADD_ARTIST_TO_ALBUM = gql`
  mutation AddArtistToAlbum($id: ID!, $artistId: ID!) {
    addArtistToAlbum(_id: $id, artistId: $artistId) {
      _id
      title
    }
  }
`;

const GET_NEXT_SONGS = gql`
  query getNextSongs($clickedSongId: ID!) {
    getNextSongs(clickedSongId: $clickedSongId) {
      _id
      duration
      title
      likes
      song_url
      cover_image_url
      writtenBy
      producers
      language
      genre
      lyrics
      release_date
    }
  }
`;

const TOGGLE_FOLLOW_ARTIST = gql`
  mutation ToggleFollowArtist($id: ID!) {
  toggleFollowArtist(_id: $id) {
    _id
    display_name
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
  GET_DASHBOARD_DATA,
  GET_DASHBOARD_USERS,
  GET_DASHBOARD_ARTISTS,
  GET_DASHBOARD_ALBUMS,
  GET_DASHBOARD_SONGS,
  REMOVE_USER,
  REMOVE_ARTIST,
  REMOVE_ALBUM,
  REMOVE_SONG,
  REMOVE_PLAYLIST,
  GET_ARTIST_BY_ID,
  GET_ALBUMS_BY_ARTIST,
  ADD_ALBUM,
  EDIT_ALBUM,
  GET_ALBUM_BY_ID,
  GET_SONGS_BY_ARTIST,
  GET_SONG_BY_ID,
  ADD_SONG,
  EDIT_SONG,
  EDIT_ARTIST,
  TOGGLE_PLAYLIST,
  GET_PLAYLIST,
  EDIT_PLAYLIST,
  CREATE_PLAYLIST,
  GET_SONG_BY_TITLE,
  ADD_SONG_TO_PLAYLIST,
  REMOVE_SONG_FROM_PLAYLIST,
  REMOVE_SONG_FROM_ALBUM,
  REMOVE_ARTIST_FROM_ALBUM,
  ADD_SONG_TO_ALBUM,
  ADD_ARTIST_TO_ALBUM,
  GET_NEXT_SONGS,
  TOGGLE_FOLLOW_ARTIST
};

export default queries;
