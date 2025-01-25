import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

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

export const fetchHistoryData = (url) => async (dispatch) => {
  try {
    const response = await axios.get("http://127.0.0.1:8000/history");
    const data = response.data;

    for(let d of data) {
      dispatch(addHistoryItem(d.message));
    }
  } catch (error) {
    console.error("Error fetching history data", error);
  }
};

export default historySlice.reducer;
