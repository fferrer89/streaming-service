'use client';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SongState {
  currentSong: any | null;
}

const initialState: SongState = {
  currentSong: null,
};

const songSlice = createSlice({
  name: 'song',
  initialState,
  reducers: {
    playSong(state, action: PayloadAction<any>) {
      state.currentSong = action.payload;
    },
    stopSong(state) {
      state.currentSong = null;
    },
  },
});

export const { playSong, stopSong } = songSlice.actions;
export default songSlice.reducer;