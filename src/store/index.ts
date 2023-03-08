import { configureStore } from '@reduxjs/toolkit';
import authModalReducer from '@/store/authModalSlice';
import communityReducer from '@/store/communitySlice';
import postReducer from '@/store/postSlice';

export const store = configureStore({
  reducer: {
    authModal: authModalReducer,
    community: communityReducer,
    post: postReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
