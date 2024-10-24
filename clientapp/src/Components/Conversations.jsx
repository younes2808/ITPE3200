import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Conversations = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch conversations for the current user
  const fetchConversations = async () => {
    try {
      const storedUser = sessionStorage.getItem("user");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        const response = await fetch(
          `http://localhost:5249/api/Message/conversations/${user.id}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Fetch usernames for each conversation
        const conversationsWithUsernames = await Promise.all(
          data.map(async (conversation) => {
            const userResponse = await fetch(
              `http://localhost:5249/api/User/${conversation.userId}`
            );
            const userData = await userResponse.json();

            return {
              ...conversation,
              username: userData.username,
              // Legger til en boolean for å indikere om det finnes nye meldinger
              hasNewMessages: conversation.hasNewMessages || false, // Anta at backend gir denne infoen
            };
          })
        );

        // Sort conversations by timestamp (newer on top)
        conversationsWithUsernames.sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        );

        setConversations(conversationsWithUsernames);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();

    const interval = setInterval(() => {
      fetchConversations();
    }, 5000);

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
    <div className="mt-auto flex-grow items-start w-full h-full">
      <div className="bg-white shadow-lg rounded-lg p-8 h-full flex flex-col">
        <h2 className="300px:text-2xl 400px:text-3xl font-extrabold font-general text-black mb-6">Conversations</h2>

        <div className="flex-grow space-y-4 overflow-y-auto">
          {conversations.length > 0 ? (
            conversations.map((conversation) => (
              <div
                key={conversation.userId}
                className={`p-4 rounded-lg cursor-pointer transition duration-200 ${
                  conversation.isResponded
                    ? "bg-emerald-200 hover:bg-emerald-300" // Sending messages
                    : "bg-emerald-100 hover:bg-emerald-300 shadow-md" // Receiving messages
                } flex justify-between items-center`}
                onClick={() => handleConversationClick(conversation.userId)}
              >
                <div className="flex flex-col">
                  <p className="text-lg font-semibold">
                    <span
                      className="text-black hover:underline font-general cursor-pointer"
                      onClick={() => handleUsernameClick(conversation.userId)}
                    >
                      {conversation.username}
                    </span>
                  </p>
                  <p
                    className={`text-sm ${
                      conversation.isResponded
                        ? "text-gray-500 font-semibold font-lexend"
                        : "text-gray-500 font-bold font-lexend"
                    }`}
                  >
                    {conversation.isResponded ? "Sent:" : "Received:"}{" "}
                    {conversation.content}
                  </p>
                  <p
                    className={`text-xs ${
                      conversation.isResponded ? "font-clash pb-2 font-normal text-sm text-gray-500" : "font-clash pb-2 font-normal text-sm text-gray-500"
                    }`}
                  >
                    {new Date(conversation.timestamp).toLocaleString()}
                  </p>
                </div>

                {/* Liten sirkel for å indikere nye meldinger */}
                {!conversation.isResponded && !conversation.hasNewMessages ? (
                  <div className="bg-blue-500 rounded-full w-2.5 h-2.5 flex items-center justify-center ml-4" />
                ) : null}
              </div>
            ))
          ) : (
            <div className="text-gray-500 text-center">No conversations yet</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Conversations;
