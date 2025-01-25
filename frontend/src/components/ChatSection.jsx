import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addMessage } from "../store/slices/chatSlice";
import { addHistoryItem } from "../store/slices/historySlice";
import axios from "axios";

const ChatSection = () => {
  const messages = useSelector((state) => state.chat.messages);
  const dispatch = useDispatch();
  const [input, setInput] = useState("");

  const handleSend = async () => {
    if (input.trim() === "") return;
    dispatch(addMessage({ type: "user", text: input }));
  
    try {
      await axios.post("http://127.0.0.1:8000/history", {
        message: input,
        type: "user",
      });
  
      const response = await axios.post("http://127.0.0.1:8000/execute_query", {
        question: input,
      });
  
      const rawResult = response.data.query_result;
  
      // Check if there's a valid result
      if (!rawResult || rawResult === '[]' || rawResult === '{}') {
        throw new Error("No query result returned");
      }
  
      const cleanedResult = rawResult
        .replace(/[\[\]']/g, "")
        .split("), (")
        .map((item) => item.replace(/[()]/g, "").split(", "));
  
      const singleLines = cleanedResult.map(([name, brand, price]) => {
        const formattedName = name || "Unnamed Product";
        const formattedBrand = brand || "Unknown Brand";
        const formattedPrice = price && !isNaN(price) ? `$${parseFloat(price).toFixed(2)}` : "Price not available";
  
        return `${formattedName} (${formattedBrand}) ${formattedPrice}\n`;
      });
  
      dispatch(addMessage({ type: "bot", text: singleLines.join("\n") }));
      dispatch(addHistoryItem(input));
  
    } catch (error) {
      console.error("Error posting history data", error.message);
  
      dispatch(
        addMessage({
          type: "bot",
          text: "An error occurred while processing your request.",
        })
      );
    }
  
    setInput("");
  };
  

  
  const handleClear = () => {
    setInput("");
  };

  return (
    <div className="flex flex-col h-screen w-full">
      <div className="flex-1 p-4 overflow-y-auto bg-gray-100">
        {messages.length > 0 ? (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`${
                msg.type === "user"
                  ? "text-right text-blue-600"
                  : "text-left text-green-600"
              } mb-2`}
            >
              <span
                className={`inline-block px-4 py-2 rounded-lg ${
                  msg.type === "user" ? "bg-blue-200" : "bg-green-200"
                }`}
              >
                {msg.text}
              </span>
            </div>
          ))
        ) : (
          <div className="text-gray-400 text-center mt-4">
            <div className="text-4xl mb-12">What can I help with?</div>
            No messages yet.
          </div>
        )}
      </div>
      <div className="p-4 bg-gray-200 flex items-center space-x-2">
        <input
          type="text"
          className="flex-1 px-4 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={handleSend}
        >
          Send
        </button>
        <button
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          onClick={handleClear}
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default ChatSection;
