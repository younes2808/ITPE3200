import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import LeftNavbar from "../Components/LeftNavbar"; // Adjust the import path as necessary
import RightNavbar from "../Components/RightNavbar"; // Adjust the import path as necessary

const MessagePage = () => {
  const { receiverId, senderId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [receiverUsername, setReceiverUsername] = useState(""); // State to hold the receiver's username
  const navigate = useNavigate();
  const messagesEndRef = useRef(null); // Ref to scroll to the bottom

  // Fetch messages initially and then at regular intervals
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(
          `http://localhost:5249/api/message/${senderId}/${receiverId}`
        );
        const data = await response.json();
        setMessages(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching messages:", error);
        setLoading(false);
      }
    };

    // Fetch receiver's username
    const fetchReceiverUsername = async () => {
      try {
        const response = await fetch(`http://localhost:5249/api/User/${receiverId}`);
        const data = await response.json();
        setReceiverUsername(data.username); // Set the username for the receiver
      } catch (error) {
        console.error("Error fetching receiver's username:", error);
      }
    };

    // Initial fetch for messages and receiver username
    fetchMessages();
    fetchReceiverUsername();

    // Polling every 5 seconds to update the messages
    const interval = setInterval(() => {
      fetchMessages();
    }, 1000);

    // Clear the interval when component unmounts
    return () => clearInterval(interval);
  }, [receiverId, senderId]);

  // Auto-scroll to the bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (newMessage.trim() === "") return;

    try {
      const messageToSend = {
        senderId: parseInt(senderId, 10),
        receiverId: parseInt(receiverId, 10),
        content: newMessage,
      };

      await fetch("http://localhost:5249/api/Message/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(messageToSend),
      });

      // Fetch the updated messages after sending
      const response = await fetch(
        `http://localhost:5249/api/message/${senderId}/${receiverId}`
      );
      const updatedMessages = await response.json();
      setMessages(updatedMessages);
      setNewMessage(""); // Clear input field
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  if (loading) return <div className="text-white">Loading...</div>;

  return (
    <div className="flex h-screen bg-gray-900">
      <LeftNavbar />
      <div className="flex-grow ml-64 py-6 md:mr-[17vw] mr-5">
        <div className="bg-gray-800 shadow-lg rounded-lg p-8 h-full flex flex-col">
          <div className="flex items-center justify-between bg-gray-700 p-4 rounded-t">
            <button
              onClick={() => navigate(`/conversation/${senderId}`)}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition duration-200"
            >
              Back to Conversations
            </button>
            {/* Display the receiver's username instead of "Conversation" */}
            <h2
              onClick={() => navigate(`/profile/${receiverId}`)} // Clickable username to navigate to profile
              className="text-2xl font-extrabold text-white cursor-pointer hover:underline"
            >
              {receiverUsername}
            </h2>
          </div>

          <div
            className="flex-grow space-y-4 overflow-y-auto mt-4"
            style={{
              scrollbarWidth: '3px', // For Firefox (smaller scrollbar width)
              overflowY: 'scroll',
              paddingRight: '5px', // Prevent content from getting cut off by scrollbar
            }}
          >
            {messages.length > 0 ? (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`mb-4 p-3 rounded-lg shadow ${
                    message.senderId === parseInt(senderId)
                      ? "bg-blue-500 text-white text-right"
                      : "bg-gray-600 text-white text-left"
                  }`}
                >
                  <p className="text-lg font-semibold">{message.content}</p>
                  <p className="text-xs text-gray-300">
                    {new Date(message.timestamp).toLocaleString()}
                  </p>
                </div>
              ))
            ) : (
              <div className="text-gray-400 text-center">No messages yet</div>
            )}
            <div ref={messagesEndRef} /> {/* Empty div to scroll to */}
          </div>

          <div className="bg-gray-700 p-4 border-t border-gray-600 mt-4">
            <div className="flex items-center">
              <input
                type="text"
                className="flex-grow border border-gray-600 p-2 rounded mr-2 bg-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button
                onClick={sendMessage}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition duration-200"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
      <RightNavbar />
    </div>
  );
};

export default MessagePage;
