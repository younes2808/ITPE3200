import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchMessagesBetweenUsers, sendMessage } from "../Services/messageService";
import { fetchUsernameById } from "../Services/userService";

const Messages = () => {
  const { receiverId, senderId } = useParams(); // Get the receiver's and sender's ID from the URL
  const [messages, setMessages] = useState([]); // State for messages
  const [newMessage, setNewMessage] = useState(""); // State for new message
  const [loading, setLoading] = useState(true); // State for loading
  const [receiverUsername, setReceiverUsername] = useState(""); // State for receiver's username
  const [sending, setSending] = useState(false); // State to track if a message is being sent
  const [warning, setWarning] = useState(""); // State for warning message
  const messagesEndRef = useRef(null); // Ref to scroll to the bottom of the message list
  const [firstLoad, setFirstLoad] = useState(false); // State to track first load
  const navigate = useNavigate(); // Hook for navigation

  // Get loggedInUserId from sessionStorage
  const userid = sessionStorage.getItem('user');
  const id = JSON.parse(userid);
  const loggedInUserId = id?.id; // Get ID if it exists

  // Check if senderId matches loggedInUserId
  useEffect(() => {
    if (parseInt(senderId) !== loggedInUserId) {
      setWarning("You are not authorized to access this conversation.");
      setTimeout(() => navigate("/feed"), 3000); // Redirecting to the feed after 3 seconds
    }
  }, [loggedInUserId, senderId, navigate]); // Run effect on mount and if these dependencies change

  // Fetch messages and username
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const data = await fetchMessagesBetweenUsers(senderId, receiverId); // Fetch messages between users
        setMessages(data); // Update messages in state
      } catch (error) {
        console.error("Error fetching messages:", error); // Log error
      } finally {
        setLoading(false); // Set loading to false regardless
      }
    };

    const fetchReceiverUsername = async () => {
      try {
        const username = await fetchUsernameById(receiverId); // Fetch receiver's username
        setReceiverUsername(username); // Update receiver's username in state
      } catch (error) {
        console.error("Error fetching receiver's username:", error); // Log error
      }
    };

    if (parseInt(senderId) === loggedInUserId) {
      fetchMessages(); // Call to fetch messages
      fetchReceiverUsername(); // Call to fetch username

      // Polling to update messages every second
      const interval = setInterval(fetchMessages, 1000);
      return () => clearInterval(interval); // Clean up interval when component unmounts
    }
  }, [receiverId, senderId, loggedInUserId]); // Run effect when receiverId, senderId, or loggedInUserId changes

  // Auto-scroll to the bottom when messages change, but only on the first load
  useEffect(() => {
    if (messages.length > 0 && !firstLoad) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        setFirstLoad(true); // Set firstLoad to true after the first scroll
      }, 0); // Ensures scrolling happens after the render cycle
    }
  }, [messages, firstLoad]); // Check firstLoad before scrolling

  const handleSendMessage = async () => {
    if (newMessage.trim() === "") {
      setWarning("You cannot send an empty message!"); // Set warning if message is empty
      return; // Prevent sending if the message is empty
    }
  
    if (sending) return; // Prevent sending if already in progress
  
    setSending(true); // Set sending to true to indicate that the message is being sent
    setWarning(""); // Clear the warning message if a valid message is being sent
  
    try {
      await sendMessage(senderId, receiverId, newMessage); // Send the message
      const updatedMessages = await fetchMessagesBetweenUsers(senderId, receiverId); // Fetch updated messages
      setMessages(updatedMessages); // Update messages in state
      setNewMessage(""); // Clear the input field
  
      // Scroll to the bottom after sending the message
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100); // Timeout ensures scrolling happens after state update
    } catch (error) {
      console.error("Error sending message:", error); // Log error
    } finally {
      setSending(false); // Set sending back to false
    }
  };
  
  // Handle input change for message field
  const handleInputChange = (e) => {
    setNewMessage(e.target.value); // Update state with new message
  };

  if (loading) return <div className="text-white">Loading...</div>; // Show loading indicator
  if (warning) return <div className="text-red-500">{warning}</div>; // Show warning if unauthorized

  return (
    <div className="mt-auto flex-grow items-start w-full h-full">
      <div className="bg-white shadow-2xl border-gray-300 border-2 rounded-lg p-8 h-full flex flex-col">
        {/* Header with back button and receiver's username */}
        <div className="flex items-center justify-between bg-emerald-200 p-4 rounded-md">
          <button
            onClick={() => navigate(`/conversation/${loggedInUserId}`)} // Navigate back to conversations
            className="text-black text-4xl"
          >
            ←
          </button>
          <h2 
            className="text-2xl font-extrabold font-general text-black mr-4 cursor-pointer hover:underline ml-auto"
            onClick={() => navigate(`/profile/${receiverId}`)} // Navigate to receiver's profile
          >
            {receiverUsername}
          </h2>
        </div>

        {/* Message display area */}
        <div className="flex-grow space-y-4 overflow-y-auto mt-4 post-textarea-grey">
          {messages.length > 0 ? (
            messages.map((message) => (
              <div
                key={message.id} // Unique key for each message
                className={`mb-4 p-3 w-fit rounded-lg shadow max-w-[75%] break-words ${
                  message.senderId === parseInt(senderId)
                    ? "bg-blue-500 text-white font-normal text-right ml-auto rounded-tl-2xl rounded-br-2xl"
                    : "bg-gray-300 text-black font-normal text-left rounded-tr-2xl rounded-bl-2xl"
                }`}
              >
                <p
                  className={`text-lg font-semibold ${
                    message.senderId === parseInt(senderId) ? "text-white" : "text-black"
                  }`}
                >
                  {message.content} {/* Display message content*/ }
                </p>
                <p className="text-xs">
                  {new Date(message.timestamp).toLocaleString()} {/* Display message timestamp */}
                </p>
              </div>
            ))
          ) : (
            <div className="text-gray-400 text-center">No messages yet</div> // Message if there are no messages
          )}
          <div ref={messagesEndRef} /> {/* Ref to scroll to the bottom */}
        </div>

        {/* Warning message */}
        {warning && <div className="text-red-500 text-center mt-2">{warning}</div>}

        {/* Input area for sending new messages */}
        <div className="bg-emerald-200 border p-4 mt-4 rounded-md">
          <div className="flex items-center">
            <input
              type="text"
              className="flex-grow p-2 border-gray-300 border-2 rounded mr-2 bg-white text-black focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Type a message..."
              value={newMessage}
              onChange={handleInputChange} // Handle input change
            />
            <button
              onClick={handleSendMessage} // Call to send message
              disabled={sending} // Disable button if sending is in progress
              className={`bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500 transition duration-200 ${sending ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
