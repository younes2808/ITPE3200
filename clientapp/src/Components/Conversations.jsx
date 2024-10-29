import React, { useState, useEffect } from "react"; // Import React and hooks
import { useNavigate } from "react-router-dom"; // Import hook for navigation
import { fetchConversations } from "../Services/messageService"; // Import service to fetch conversations
import { fetchUsernameById } from "../Services/userService"; // Import service to fetch usernames

const Conversations = () => {
  const [conversations, setConversations] = useState([]); // State to hold conversations
  const [loading, setLoading] = useState(true); // State to handle loading status
  const navigate = useNavigate(); // Hook to enable navigation

  // Fetch conversations for the current user
  const fetchConversationsWithUsernames = async () => {
    try {
      const storedUser = sessionStorage.getItem("user"); // Retrieve user info from session storage
      if (storedUser) {
        const user = JSON.parse(storedUser); // Parse user info
        const conversations = await fetchConversations(user.id); // Fetch conversations using user ID

        // Fetch usernames for each conversation
        const conversationsWithUsernames = await Promise.all(
          conversations.map(async (conversation) => {
            const username = await fetchUsernameById(conversation.userId); // Fetch username
            return {
              ...conversation,
              username,
              hasNewMessages: conversation.hasNewMessages || false, // Add hasNewMessages property
            };
          })
        );

        setConversations(conversationsWithUsernames); // Update state with fetched conversations
      }
    } catch (error) {
      console.error("Error fetching conversations:", error); // Log any errors
    } finally {
      setLoading(false); // Ensure loading is set to false after fetching
    }
  };

  useEffect(() => {
    fetchConversationsWithUsernames(); // Call the function to fetch conversations with usernames

    // Set up interval to refresh conversations every 5 seconds
    const interval = setInterval(() => {
      fetchConversationsWithUsernames();
    }, 5000);

    return () => clearInterval(interval); // Clean up interval on component unmount
  }, []);

  // Handle click on a conversation to navigate to the message page
  const handleConversationClick = (receiverId) => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      navigate(`/message/${receiverId}/${user.id}`); // Navigate to message page
    }
  };

  // Handle click on a username to navigate to the user's profile
  const handleUsernameClick = (userId) => {
    navigate(`/profile/${userId}`); // Navigate to profile page
  };

  if (loading) return <div className="text-white">Loading...</div>; // Display loading message while fetching

  return (
    <div className="mt-auto flex-grow items-start w-full h-full">
      <div className="bg-white shadow-lg rounded-lg p-8 h-full flex flex-col">
        <h2 className="300px:text-2xl 400px:text-3xl font-extrabold font-general text-black mb-6">Conversations</h2>

        <div className="flex-grow space-y-4 overflow-y-auto">
          {conversations.length > 0 ? ( // Check if there are any conversations
            conversations.map((conversation) => (
              <div
                key={conversation.userId} // Use userId as a unique key
                className={`p-4 rounded-lg cursor-pointer transition duration-200 ${
                  conversation.isResponded
                    ? "bg-emerald-200 hover:bg-emerald-300" // Style for sent messages
                    : "bg-emerald-100 hover:bg-emerald-300 shadow-md" // Style for received messages
                } flex justify-between items-center`}
                onClick={() => handleConversationClick(conversation.userId)} // Handle conversation click
              >
                <div className="flex flex-col">
                  <p className="text-lg font-semibold">
                    <span
                      className="text-black hover:underline font-general cursor-pointer"
                      onClick={() => handleUsernameClick(conversation.userId)} // Handle username click
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
                    {conversation.content} {/* Display message content */}
                  </p>
                  <p
                    className={`text-xs ${
                      conversation.isResponded ? "font-clash pb-2 font-normal text-sm text-gray-500" : "font-clash pb-2 font-normal text-sm text-gray-500"
                    }`}
                  >
                    {new Date(conversation.timestamp).toLocaleString()} {/* Display timestamp */}
                  </p>
                </div>

                {/* Indicator for new messages */}
                {!conversation.isResponded && !conversation.hasNewMessages ? (
                  <div className="bg-blue-500 rounded-full w-2.5 h-2.5 flex items-center justify-center ml-4" />
                ) : null}
              </div>
            ))
          ) : (
            <div className="text-gray-500 text-center">No conversations yet</div> // Message when no conversations exist
          )}
        </div>
      </div>
    </div>
  );
};

export default Conversations; // Export the Conversations component