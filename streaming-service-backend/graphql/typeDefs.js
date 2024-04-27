export const typeDefs = `#graphql

  type Query {
  
  users: [User]
  getUserById(_id: ID!): User
  getUserFollowers(userId: String!): [User]
  getUserFollowing(userId: String!): [User]
  

  artists: [Artist]
  getArtistById(_id: ID!): Artist
#FIXME returns the first artist found by a given first_name
  getArtistsByName(name: String!): [Artist]
#FIXME how to calculate this? Artists cannot be "liked" according to the DB schema
  getMostFollowedArtists: [Artist]
  getArtistsByAlbumId(albumId: ID!): [Artist]
#FIXME we need artists with followers in the DB schema
  getUserFollowedArtists(userId: ID!): [Artist]

  albums: [Album]
  getAlbumById(_id: ID!): Album
  getAlbumsByTitle(searchTerm: String!): [Album]
  getAlbumsByVisibility(visibility: String!): [Album]
  getAlbumsByReleasedYear(year: Int!): [Album]
  getAlbumsByGenre(genre: String!): [Album]
  getNewlyReleasedAlbums: [Album]
  getMostLikedAlbums: [Album]
#    FIXME albums cannot be liked by users according to the DB schema
  getUserLikedAlbums(userId: String!): [Album]
  getAlbumsByArtist(artistId: String!): [Album]


  songs: [Song]
  getSongById(_id: ID!): Song
  getSongsByTitle(searchTerm: String!): [Song]
  getSongsByAlbumID(albumId: String!): [Song]
  getSongsByArtistID(artistId: String!): [Song]
  getSongsByWriter(searchTerm: String!): [Song]
  getSongsByProducer(searchTerm: String!): [Song]
  getSongsByGenre(genre: MusicGenre!): [Song]
  getNewlyReleasedSongs: [Song]
  getMostLikedSongs: [Song]
  getTrendingSongs: [Song]
  getUserLikedSongs(userId: String!): [Song]
  getRecommendedSongs(userId: ID!): [Song]
  getMostLikedSongsOfArtist(artistId: ID!): [Song]

  playlists: [Playlist]
  getPlaylistById(_id: ID!): Playlist
  getPlaylistsByTitle(searchTerm: String!): [Playlist]
  getPlaylistsByOwner(userId: ID!): [Playlist]
  getPlaylistsByVisibility(visibility: Visibility!): [Playlist]
  getMostLikedPlaylists: [Playlist]

  getUserLikedPlaylists(userId: String!): [Playlist]

  streamSong(trackID: ID!): Stream

  
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
      genres: [MusicGenre!]!
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
        genres: [MusicGenre]
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
        genres: [MusicGenre!]!,
        visibility: Visibility!
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


#    FIXME what is the intended behavior of this operation?
    addSongToAlbum(_id: ID!, songId: ID!): Album
    removeSongFromAlbum(_id: ID!, songId: ID!): Album

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


  
  addSongToPlaylist(playlistId: ID!, songId: ID!): Playlist
  removeSongFromPlaylist(playlistId: ID!, songId: ID!): Playlist
  removePlaylist(playlistId: ID!): Playlist

  toggleLikeSong(_id: ID!, songId: ID!): Song
  toggleLikeArtist(_id: ID!, artistId: ID!): Artist
  toggleLikePlaylist(playlistId: ID!): Playlist
  toggleLikeAlbum(_id: ID!, albumId: ID!): Album


  uploadSongFile(file: Upload!): ID

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
    genres: [MusicGenre!]!
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
    genres: [MusicGenre!]!
    likes: Int
    total_duration: Int
    visibility: Visibility!
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
    visibility: Visibility!
    owner: User!
    songs: [Song]
    created_date: Date!
    likes: Int!
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


enum Visibility {
    PUBLIC
    PRIVATE
}
enum AlbumType {
    ALBUM
    SINGLE
    COMPILATION
    APPEARS_ON
}

scalar Date

scalar Upload

scalar Stream
`;
