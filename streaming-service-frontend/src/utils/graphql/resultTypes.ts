export type FeedQueryResult = {
  getMostLikedSongs: {
    _id: string;
    duration: number;
    genre: string;
    language: string;
    likes: number;
    lyrics: string;
    producers: string[];
    release_date: string;
    album: {
      _id: string;
      title: string;
      cover_image_url: string;
    };
    song_url: string;
    title: string;
    writtenBy: string;
    cover_image_url: string;
    artists: {
      _id: string;
      display_name: string;
      profile_image_url: string;
    }[];
  }[];
  getMostFollowedArtists: {
    created_date: string;
    date_of_birth: string;
    _id: string;
    display_name: string;
    email: string;
    first_name: string;
    gender: string;
    genres: string[];
    last_name: string;
    profile_image_url: string;
  }[];
  getNewlyReleasedAlbums: {
    _id: string;
    album_type: string;
    artists: {
      display_name: string;
      profile_image_url: string;
      last_name: string;
    }[];
    cover_image_url: string;
    total_songs: number;
    songs: {
      _id: string;
    }[];
    description: string;
    created_date: string;
    title: string;
  }[];
  getMostLikedAlbums: {
    _id: string;
    album_type: string;
    artists: {
      display_name: string;
      profile_image_url: string;
      last_name: string;
    }[];
    cover_image_url: string;
    total_songs: number;
    songs: {
      _id: string;
    }[];
    description: string;
    created_date: string;
    title: string;
  }[];
  getNewlyReleasedSongs: {
    _id: string;
    duration: number;
    genre: string;
    language: string;
    likes: number;
    lyrics: string;
    producers: string[];
    release_date: string;
    album: {
      _id: string;
      title: string;
      cover_image_url: string;
    };
    song_url: string;
    title: string;
    writtenBy: string;
    cover_image_url: string;
    artists: {
      _id: string;
      display_name: string;
      profile_image_url: string;
    }[];
  }[];
};

export type UserLikedSong = {
  _id: string;
  title: string;
  duration: number;
  song_url: string;
  writtenBy: string;
  producers: string[];
  language: string;
  genre: string;
  lyrics: string;
  release_date: string;
  album: {
    _id: string;
    title: string;
    cover_image_url: string;
  };
  artists: {
    _id: string;
    display_name: string;
    profile_image_url: string;
  }[];
};
export type SongsByArtistID = {
  _id: string;
  title: string;
  duration: number;
  song_url: string;
  writtenBy: string;
  producers: string[];
  language: string;
  genre: string;
  lyrics: string;
  release_date: string;
  album: {
    _id: string;
    title: string;
    cover_image_url: string;
  };
  artists: {
    _id: string;
    display_name: string;
    profile_image_url: string;
  }[];
};

export type GetUserPlaylist = {
  _id: string;
  description: string;
  title: string;
};

export type GetUserPlaylistsVariables = {
  userId: string;
};
