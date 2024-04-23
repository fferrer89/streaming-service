export const typeDefs = `#graphql
  type Query {
  
  users: [User]
  getUserById(_id: ID!): User
  getUserFollowers(userId: String!): [User]
  getUserFollowing(userId: String!): [User]
  

  artists: [Artist]
  getArtistById(_id: ID!): Artist
  getArtistByName(name: String!): Artist
  getMostLikedArtists: [Artist]
  getArtistsByAlbum(artistId: String!): [Artist]
  getUserFollowedArtists(userId: String!): [Artist]

  albums: [Album]
  getAlbumById(_id: ID!): Album
  getAlbumsByTitle(searchTerm: String!): [Album]
  getAlbumsByVisibility(visibility: String!): [Album]
  getAlbumsByReleasedYear(year: Int!): [Album]
  getAlbumsByGenre(genre: String!): [Album]
  getNewlyReleasedAlbums: [Album]
  getMostLikedAlbums: [Album]
  getUserLikedAlbums(userId: String!): [Album]
  getAlbumsByArtist(artistId: String!): [Album]


  songs: [Song]
  getSongById(_id: ID!): Song
  getSongsByTitle(searchTerm: String!): [Song]
  getSongsByAlbumID(albumId: String!): [Song]
  getSongsByArtistID(artistId: String!): [Song]
  getSongsByWriter(searchTerm: String!): [Song]
  getSongsByProducer(searchTerm: String!): [Song]
  getSongsByGenre(genre: String!): [Song]
  getNewlyReleasedSongs: [Song]
  getMostLikedSongs: [Song]
  getTrendingSongs: [Song]
  getUserLikedSongs(userId: String!): [Song]
  getRecommendedSongs(userId: ID!): [Song]
  getMostLikedSongsOfArtist(artistId: ID!): [Song]

  playlists: [Playlist]
  getPlaylistById(_id: ID!): Playlist
  getPlaylistsByTitle(searchTerm: String!): [Playlist]
  getPlaylistsByOwner(userId: String!): [Playlist]
  getPlaylistsByVisibility(visibility: String!): [Playlist]
  getMostLikedPlaylists: [Playlist]
  getUserLikedPlaylists(userId: String!): [Playlist]
  
}

type Mutation {
  registerUser(first_name: String!, last_name: String!, display_name: String!, email: String!, password: String!, profile_image_url: String!): RegisterUserResponse!
  
  
 
  loginUser(email: String!, password: String!): RegisterUserResponse!

  editUser(
    userId: ID!,
    first_name: String,
    last_name: String,
    display_name: String,
    email: String,
    profile_image_url: String
  ): User

  registerArtist(
      first_name: String!,
      last_name: String!,
      display_name: String!,
      email: String!,
      password: String!,
      profile_image_url: String!,
      genres: [String!]!
    ): RegisterArtistResponse

  loginArtist(email: String!, password: String!): RegisterArtistResponse!
  
  editArtist(
    artistId: ID!,
    first_name: String,
    last_name: String,
    display_name: String,
    email: String,
    password: String,
    profile_image_url: String,
    genres: [String]
  ): Artist

  addAlbum(
    album_type: String!,
    total_songs: Int!,
    cover_image_url: String!,
    title: String!,
    description: String!,
    release_date: Date!,
    artists: [ID!]!,
    songs: [ID!]!,
    genres: [String!]!,
    visibility: String!
    ): Album

  editAlbum(_id: ID!, album_type: String,
    total_songs: Int,
    cover_image_url: String,
    title: String,
    description: String,
    release_date: Date,
    artists: [ID!],
    songs: [ID!],
    genres: [String!],
    visibility: String): Album


  toggleSongToAlbum(_id: ID!, songId: ID!): Album

  removeAlbum(_id: ID!): Album

  addSong(
    title: String!,
    duration: Int!,
    song_url: String!,
    cover_image_url: String!,
    writtenBy: String!,
    producers: [String!]!,
    genre: String!,
    release_date: Date!,
    artists:[ID!]!,
    lyrics:String,
    album: ID,
  ): Song!

  editSong(songId: ID!, title: String,
    duration: Int,
    song_url: String,
    cover_image_url: String,
    writtenBy: String,
    producers: [String!],
    genre: String,
    release_date: Date, 
    artists:[ID!],): Song

  removeSong(songId: ID!): Song

  createPlaylist(description: String!,
      title: String!,
      visibility: String!): Playlist!


  
  toggleSongToPlaylist(_id: ID!, songId: ID!): Playlist
  removePlaylist(_id: ID!): Playlist

  toggleLikeSong(_id: ID!, songId: ID!): Song
  toggleLikeArtist(_id: ID!, artistId: ID!): Artist
  toggleLikePlaylist(_id: ID!, playlistId: ID!): Playlist
  toggleLikeAlbum(_id: ID!, albumId: ID!): Album
}

type RegisterUserResponse {
  user: User!
  token: String!
}

type User {
  _id: ID!
  first_name: String!
  last_name: String!
  display_name: String!
  email: String!
  created_date: Date!
  password_changed_date: Date
  date_of_birth: String
  gender: String
  profile_image_url: String!
  liked_songs: [LikedSong]!
}

type LikedSong {
  songId: ID!
  liked_date: String!
}

type Artist {
    _id: ID!
    first_name: String!
    last_name: String!
    display_name: String!
    email: String!
    created_date: Date!
    password_changed_date: Date
    date_of_birth: String
    gender: String
    following: Following
    followers: Followers
    profile_image_url: String!
    genres: [String!]!
  }

  type Following {
    users: [User]
    artists: [Artist]
  }

  type Followers {
    users: [User]
    artists: [Artist]
  }

  type RegisterArtistResponse {
    artist: Artist
    token: String!
  }


  type Album {
  _id: ID!
  album_type: String!
  total_songs: Int!
  cover_image_url: String!
  title: String!
  description: String!
  release_date: Date!
  created_date: Date!
  last_updated: Date!
  artists: [Artist!]!
  songs: [Song!]!
  genres: [String!]!
  likes: Int
  total_duration: Int
  visibility: PlaylistVisibility!
}

type Song {
  _id: ID!
  album: Album
  artists: [Artist!]!
  duration: Int!
  title: String!
  likes: Int
  song_url: String!
  cover_image_url: String!
  writtenBy: String!
  producers: [String!]!
  language: String
  genre: MusicGenre!
  lyrics: String
  release_date: Date!
}


type Playlist {
  _id: ID!
  description: String!
  title: String!
  visibility: PlaylistVisibility!
  owner: User!
  songs: [Song]
  created_date: Date!
}

type LikedUser {
  userId: ID!
  likedDate: Date!
}

enum MusicGenre {
  ACOUSTIC
  AFROBEAT
  ALT_ROCK
  ALTERNATIVE
  AMBIENT
  ANIME
  BLACK_METAL
  BLUEGRASS
  BLUES
  BOSSANOVA
  BRAZIL
  BREAKBEAT
  BRITISH
  CANTOPOP
  CHICAGO_HOUSE
  CHILDREN
  CHILL
  CLASSICAL
  CLUB
  COMEDY
  COUNTRY
  DANCE
  DANCEHALL
  DEATH_METAL
  DEEP_HOUSE
  DETROIT_TECHNO
  DISCO
  DISNEY
  DRUM_AND_BASS
  DUB
  DUBSTEP
  EDM
  ELECTRO
  ELECTRONIC
  EMO
  FOLK
  FORRO
  FRENCH
  FUNK
  GARAGE
  GERMAN
  GOSPEL
  GOTH
  GRINDCORE
  GROOVE
  GRUNGE
  GUITAR
  HAPPY
  HARD_ROCK
  HARDCORE
  HARDSTYLE
  HEAVY_METAL
  HIP_HOP
  HOLIDAYS
  HONKY_TONK
  HOUSE
  IDM
  INDIAN
  INDIE
  INDIE_POP
  INDUSTRIAL
  IRANIAN
  J_DANCE
  J_IDOL
  J_POP
  J_ROCK
  JAZZ
  K_POP
  KIDS
  LATIN
  LATINO
  MALAY
  MANDOPOP
  METAL
  METAL_MISC
  METALCORE
  MINIMAL_TECHNO
  MOVIES
  MPB
  NEW_AGE
  NEW_RELEASE
  OPERA
  PAGODE
  PARTY
  PHILIPPINES_OPM
  PIANO
  POP
  POP_FILM
  POST_DUBSTEP
  POWER_POP
  PROGRESSIVE_HOUSE
  PSYCH_ROCK
  PUNK
  PUNK_ROCK
  R_N_B
  RAINY_DAY
  REGGAE
  REGGAETON
  ROAD_TRIP
  ROCK
  ROCK_N_ROLL
  ROCKABILLY
  ROMANCE
  SAD
  SALSA
  SAMBA
  SERTANEJO
  SHOW_TUNES
  SINGER_SONGWRITER
  SKA
  SLEEP
  SONGWRITER
  SOUL
  SOUNDTRACKS
  SPANISH
  STUDY
  SUMMER
  SWEDISH
  SYNTH_POP
  TANGO
  TECHNO
  TRANCE
  TRIP_HOP
  TURKISH
  WORK_OUT
  WORLD_MUSIC
}


enum PlaylistVisibility {
  PUBLIC
  PRIVATE
}

scalar Date
`;
