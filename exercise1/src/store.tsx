import { configureStore } from "@reduxjs/toolkit";
import examReducer from "./features/question/questionSlice";

const store = configureStore({
  reducer: {
    exams: examReducer,

    // Add other reducers here if present in your store
  },
});

export type RootState = ReturnType<typeof store.getState>;
export default store;
