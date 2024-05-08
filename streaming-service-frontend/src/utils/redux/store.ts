'use client';
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './features/user/userSlice';
import songReducer from './features/song/songSlice';
import modalReducer from "./features/modal/modalSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    song: songReducer,
    modal: modalReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;