'use client';
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import userReducer from './features/user/userSlice';
import songReducer from './features/song/songSlice';
import modalReducer from "./features/modal/modalSlice";

const userPersistConfig = {
  key: 'user',
  storage: storage,
  whitelist: ['token', 'userType', 'loggedIn', 'expirationTime', 'userId'] // Added more fields to persist
};

const persistedUserReducer = persistReducer(userPersistConfig, userReducer);

export const store = configureStore({
  reducer: {
    user: persistedUserReducer,
    song: songReducer,
    modal: modalReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST']
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;