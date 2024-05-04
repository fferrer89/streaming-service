import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Song {
  id: number;
  title: string;
  artist: string;
  duration: number;
  currentTime: number;
}

interface SongState {
  currentSong: Song | null;
  isPlaying: boolean;
}

const initialState: SongState = {
  currentSong: null,
  isPlaying: false,
};

const songSlice = createSlice({
  name: 'song',
  initialState,
  reducers: {
    playSong(state, action: PayloadAction<Song>) {
      state.currentSong = action.payload;
      state.isPlaying = true;
    },
    pauseSong(state) {
      state.isPlaying = false;
    },
    stopSong(state) {
      state.currentSong = null;
      state.isPlaying = false;
    },
    updateCurrentTime(state, action: PayloadAction<number>) {
      if (state.currentSong) {
        state.currentSong.currentTime = action.payload;
      }
    },
  },
});

export const { playSong, pauseSong, stopSong, updateCurrentTime } = songSlice.actions;
export default songSlice.reducer;