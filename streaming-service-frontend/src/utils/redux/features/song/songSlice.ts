import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Song {
  _id: string;
  title: string;
  duration: number;
  song_url: string;
  writtenBy: string;
  producers: string[];
  language: string;
  genre: string;
  lyrics: string;
  release_date: Date;
  album: {
    _id: string;
    title: string;
  };
  artists: {
    _id: string;
    display_name: string;
    profile_image_url: string;
  }[];
  currentTime: number;
}

interface SongState {
  currentSong: Song | null;
  isPlaying: boolean;
  currentTime: number;
}

const initialState: SongState = {
  currentSong: null,
  isPlaying: false,
  currentTime: 0,
};

const songSlice = createSlice({
  name: 'song',
  initialState,
  reducers: {
    playSong(state, action: PayloadAction<Song>) {
      if (state.currentSong && state.currentSong._id === action.payload._id) {
        state.isPlaying = true;

      } else {
      
        state.currentSong = action.payload;
        state.currentSong.currentTime = 0;
        state.isPlaying = true;
        state.currentTime = 0;
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
        state.currentSong.currentTime = action.payload;
        state.currentTime = action.payload;
      }
    },
  },
});

export const { playSong, pauseSong, stopSong, updateCurrentTime } = songSlice.actions;
export default songSlice.reducer;