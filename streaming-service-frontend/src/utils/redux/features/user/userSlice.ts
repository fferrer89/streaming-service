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

const getInitialState = (): UserState => {
  const loggedIn = typeof window !== "undefined" ? localStorage.getItem('loggedIn') === 'true' : false;
  const userData = typeof window !== "undefined" ? JSON.parse(localStorage.getItem('userData') || 'null') : null;
  const token = typeof window !== "undefined" ? localStorage.getItem('token') : null;
  const expirationTime = typeof window !== "undefined" ? Number(localStorage.getItem('expirationTime')) : null;
  const userType = typeof window !== "undefined" ? localStorage.getItem('userType') as
    | 'user'
    | 'artist'
    | 'admin'
    | null : null;
  const userId = typeof window !== "undefined" ? localStorage.getItem('userId') : null;

  if (expirationTime && expirationTime < Date.now()) {
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('userData');
    localStorage.removeItem('token');
    localStorage.removeItem('expirationTime');
    localStorage.removeItem('userType');
    localStorage.removeItem('userId');
    return {
      loggedIn: false,
      userData: null,
      token: null,
      expirationTime: null,
      userType: null,
      userId: null,
    };
  }

  return {
    loggedIn,
    userData,
    token,
    expirationTime,
    userType,
    userId,
  };
};

const initialState: UserState = getInitialState();

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

      localStorage.setItem('loggedIn', 'true');
      localStorage.setItem('userData', JSON.stringify(user));
      localStorage.setItem('token', token);
      localStorage.setItem('expirationTime', String(expirationTime));
      localStorage.setItem('userType', userType);
      localStorage.setItem('userId', user._id);
    },
    logout(state) {
      state.loggedIn = false;
      state.userData = null;
      state.token = null;
      state.expirationTime = null;
      state.userType = null;
      state.userId = null;

      localStorage.removeItem('loggedIn');
      localStorage.removeItem('userData');
      localStorage.removeItem('token');
      localStorage.removeItem('expirationTime');
      localStorage.removeItem('userType');
      localStorage.removeItem('userId');
    },
    register_re(
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
      localStorage.setItem('loggedIn', 'true');
      localStorage.setItem('userData', JSON.stringify(user));
      localStorage.setItem('token', token);
      localStorage.setItem('expirationTime', String(expirationTime));
      localStorage.setItem('userType', userType);
      localStorage.setItem('userId', user._id);
    },
  },
});

export const { login, logout, register_re } = userSlice.actions;
export default userSlice.reducer;
