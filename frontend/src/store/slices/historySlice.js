import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Create the history slice
const historySlice = createSlice({
  name: "history",
  initialState: {
    items: [],
  },
  reducers: {
    addHistoryItem: (state, action) => {
      state.items.push(action.payload);
    },
    clearHistory: (state) => {
      state.items = [];
    },
  },
});

export const { addHistoryItem, clearHistory } = historySlice.actions;

// Thunk action to fetch data and store it in the history
export const fetchHistoryData = (url) => async (dispatch) => {
  try {
    const response = await axios.get("http://127.0.0.1:8000/history");
    const data = response.data;

    // Add the fetched data to the history
    for(let d of data) {
      dispatch(addHistoryItem(d.message));
    }
  } catch (error) {
    console.error("Error fetching history data", error);
  }
};

export default historySlice.reducer;
