import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addMessage } from "../store/slices/chatSlice";
import { addHistoryItem, fetchHistoryData } from "../store/slices/historySlice";
import axios from "axios";

const HistorySidebar = () => {
  const historyItems = useSelector((state) => state.history.items);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchHistoryData("https://your-api-url.com/data"));
  }, [dispatch]);

  return (
    <div className="w-64 h-screen bg-gray-800 text-white p-4 overflow-y-auto lg:block sm:hidden cursor-pointer">
      <h2 className="text-lg font-bold mb-4">History</h2>
      <ul className="space-y-2">
        {historyItems.length > 0 ? (
          historyItems.map((item, index) => (
            <li
              key={index}
              className="p-3 bg-gray-700 rounded-lg shadow hover:bg-gray-600 transition-colors"
            >
              {item}
            </li>
          ))
        ) : (
          <li className="text-gray-400">No history yet</li>
        )}
      </ul>
    </div>
  );
};

export default HistorySidebar;
