'use client';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  loggedIn: boolean;
  userData: any | null;
  token: string | null;
  expirationTime: number | null;
  userType: 'user' | 'artist' | 'admin' | null;
  userId: string | null;
}

const initialState: UserState = {
  loggedIn: false,
  userData: null,
  token: null,
  expirationTime: null,
  userType: null,
  userId: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login(
      state,
      action: PayloadAction<{
        user: any;
        token: string;
        expiresIn: number;
        userType: 'user' | 'artist' | 'admin';
      }>
    ) {
      const { user, token, expiresIn, userType } = action.payload;
      const expirationTime = Date.now() + expiresIn * 1000;

      state.loggedIn = true;
      state.userData = user;
      state.token = token;
      state.expirationTime = expirationTime;
      state.userType = userType;
      state.userId = user._id;
    },
    logout(state) {
      state.loggedIn = false;
      state.userData = null;
      state.token = null;
      state.expirationTime = null;
      state.userType = null;
      state.userId = null;
    },
    register(
      state,
      action: PayloadAction<{
        user: any;
        token: string;
        expiresIn: number;
        userType: 'user' | 'artist' | 'admin';
      }>
    ) {
      const { user, token, expiresIn, userType } = action.payload;
      const expirationTime = Date.now() + expiresIn * 1000;
      state.loggedIn = true;
      state.userData = user;
      state.token = token;
      state.expirationTime = expirationTime;
      state.userType = userType;
      state.userId = user._id;
    },
  },
});

export const { login, logout, register } = userSlice.actions;
export default userSlice.reducer;
