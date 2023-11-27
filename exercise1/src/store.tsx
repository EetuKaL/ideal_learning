import { configureStore } from '@reduxjs/toolkit';
import questionReducer from './features/question/questionSlice';

const store = configureStore({
  reducer: {
    questions: questionReducer,
    // Add other reducers here if present in your store
  },
});

export type RootState = ReturnType<typeof store.getState>;
export default store;