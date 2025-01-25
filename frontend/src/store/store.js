import { configureStore } from "@reduxjs/toolkit";
import historyReducer from "./slices/historySlice";
import chatReducer from "./slices/chatSlice";
import { thunk } from "redux-thunk";  // Use named import instead of default

const store = configureStore({
  reducer: {
    history: historyReducer,
    chat: chatReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(thunk),  // Add thunk as middleware
});

export default store;
