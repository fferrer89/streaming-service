import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Song {
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
  likes?: number;
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
}

interface SongState {
  currentSong: Song | null;
  isPlaying: boolean;
  currentTime: number;
  nextSongs: Song[];
}

const initialState: SongState = {
  currentSong: null,
  isPlaying: false,
  currentTime: 0,
  nextSongs: [],
};

const songSlice = createSlice({
  name: "song",
  initialState,
  reducers: {
    playSong(
      state,
      action: PayloadAction<{ song: Song; currentTime: number }>
    ) {
      if (
        state.currentSong &&
        action.payload.song &&
        state.currentSong._id === action.payload.song._id
      ) {
        state.isPlaying = true;
      } else {
        state.currentSong = action.payload.song;
        state.isPlaying = true;
        state.currentTime = action.payload.currentTime;
      }
    },
    pauseSong(state) {
      state.isPlaying = false;
    },
    stopSong(state) {
      state.currentSong = null;
      state.isPlaying = false;
      state.currentTime = 0;
    },
    updateCurrentTime(state, action: PayloadAction<number>) {
      if (state.currentSong) {
        state.currentTime = action.payload;
      }
    },
    setNextSongs(state, action: PayloadAction<Song[]>) {
      state.nextSongs = action.payload;
    },
    updateCurrentSong(state, action: PayloadAction<Song>) {
      state.currentSong = { ...state.currentSong, ...action.payload };
    },
  },
});

export const {
  playSong,
  pauseSong,
  stopSong,
  updateCurrentTime,
  setNextSongs,
  updateCurrentSong,
} = songSlice.actions;
export default songSlice.reducer;
