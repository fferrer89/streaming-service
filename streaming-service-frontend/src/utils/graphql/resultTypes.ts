

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
      cover_image_url: string;
    };
    song_url: string;
    title: string;
    writtenBy: string;
    cover_image_url: string;
    artists: {
      display_name: string;
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
};
