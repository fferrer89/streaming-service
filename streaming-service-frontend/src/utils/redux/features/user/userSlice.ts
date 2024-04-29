'use client';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  loggedIn: boolean;
  userData: any | null;
}

const initialState: UserState = {
  loggedIn: false,
  userData: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login(state, action: PayloadAction<any>) {
      state.loggedIn = true;
      state.userData = action.payload;
    },
    logout(state) {
      state.loggedIn = false;
      state.userData = null;
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;