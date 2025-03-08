import { configureStore } from '@reduxjs/toolkit';
import commentsReducer from './Slices/CommentSlice';

export const store = configureStore({
  reducer: {
    comments: commentsReducer,
  },
});

// Export types for TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

