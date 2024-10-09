import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LeftNavbar from "../Components/LeftNavbar"; // Adjust the import path as necessary
import RightNavbar from "../Components/RightNavbar"; // Adjust the import path as necessary

const ConversationPage = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch conversations for the current user
  const fetchConversations = async () => {
    try {
      const storedUser = sessionStorage.getItem("user");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        const response = await fetch(`http://localhost:5249/api/Message/conversations/${user.id}`);

        // Check if response is OK
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Fetch usernames for each conversation
        const conversationsWithUsernames = await Promise.all(data.map(async (conversation) => {
          const userResponse = await fetch(`http://localhost:5249/api/User/${conversation.userId}`);
          const userData = await userResponse.json();
          return {
            ...conversation,
            username: userData.username,
          };
        }));

        // Sort conversations by timestamp (newer on top)
        conversationsWithUsernames.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        setConversations(conversationsWithUsernames);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
      setLoading(false);
    }
  };

  // Polling: Fetch conversations every 5 seconds
  useEffect(() => {
    fetchConversations();

    // Set up polling interval
    const interval = setInterval(() => {
      fetchConversations();
    }, 5000);

    // Clear interval on component unmount
    return () => clearInterval(interval);
  }, []);

  const handleConversationClick = (receiverId) => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      // Navigate to the message page for the selected conversation
      navigate(`/message/${receiverId}/${user.id}`);
    }
  };

  const handleUsernameClick = (userId) => {
    navigate(`/profile/${userId}`);
  };

  if (loading) return <div className="text-white">Loading...</div>;

  return (
    <div className="flex h-screen bg-gray-900">
      <LeftNavbar />
      <div className="flex-grow ml-64 py-6 md:mr-[17vw] mr-5">
        <div className="bg-gray-800 shadow-lg rounded-lg p-8 h-full flex flex-col">
          <h2 className="text-3xl font-extrabold text-white mb-6">Conversations</h2>

          <div className="flex-grow space-y-4 overflow-y-auto">
            {conversations.length > 0 ? (
              conversations.map((conversation) => (
                <div
                  key={conversation.userId}
                  className={`p-4 rounded-lg cursor-pointer transition duration-200 ${
                    conversation.isResponded
                      ? "bg-gray-700 hover:bg-gray-600" // Sent messages - dark gray background
                      : "bg-gray-500 hover:bg-gray-400 shadow-md" // Received messages - slightly lighter with shadow
                  }`}
                  onClick={() => handleConversationClick(conversation.userId)}
                >
                  <p className="text-lg font-semibold">
                    <span
                      className={`hover:underline cursor-pointer ${
                        conversation.isResponded ? 'text-gray-400' : 'text-white'
                      }`}
                      onClick={() => handleUsernameClick(conversation.userId)}
                    >
                      {conversation.username}
                    </span>
                  </p>
                  <p className={`text-sm ${conversation.isResponded ? 'text-gray-400 font-semibold' : 'text-white font-bold'}`}>
                    {conversation.isResponded ? "Sent:" : "Received:"} {conversation.content}
                  </p>
                  <p className={`text-xs ${conversation.isResponded ? 'text-gray-400' : 'text-white'}`}>
                    {new Date(conversation.timestamp).toLocaleString()}
                  </p>
                </div>
              ))
            ) : (
              <div className="text-gray-400 text-center">No conversations yet</div>
            )}
          </div>
        </div>
      </div>
      <RightNavbar />
    </div>
  );
};

export default ConversationPage;
