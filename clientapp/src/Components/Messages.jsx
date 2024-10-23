import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";

const Messages = () => {
  const { receiverId, senderId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [receiverUsername, setReceiverUsername] = useState(""); // State for å holde mottakerens brukernavn
  const messagesEndRef = useRef(null); // Ref for å rulle til bunnen
  const navigate = useNavigate(); // useNavigate for å navigere

  // Hent loggedInUserId fra sessionStorage
  const userid = sessionStorage.getItem('user'); // Assuming userId is stored in session storage
  const id = JSON.parse(userid);
  const loggedInUserId = id?.id; // Sjekk om id finnes for å unngå feil

  // Fetch meldinger initialt og deretter med jevne mellomrom
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

    // Fetch mottakerens brukernavn
    const fetchReceiverUsername = async () => {
      try {
        const response = await fetch(`http://localhost:5249/api/User/${receiverId}`);
        const data = await response.json();
        setReceiverUsername(data.username); // Sett brukernavnet for mottakeren
      } catch (error) {
        console.error("Error fetching receiver's username:", error);
      }
    };

    // Initial fetch for meldinger og mottakerens brukernavn
    fetchMessages();
    fetchReceiverUsername();

    // Polling hvert 5. sekund for å oppdatere meldingene
    const interval = setInterval(() => {
      fetchMessages();
    }, 1000);

    // Rens intervallet når komponenten avmonteres
    return () => clearInterval(interval);
  }, [receiverId, senderId]);

  // Auto-scroll til bunnen når meldinger endres
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

      // Fetch oppdaterte meldinger etter sending
      const response = await fetch(
        `http://localhost:5249/api/message/${senderId}/${receiverId}`
      );
      const updatedMessages = await response.json();
      setMessages(updatedMessages);
      setNewMessage(""); // Tøm inndatafelt
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Ny funksjon for å håndtere klikk på brukernavnet
  const handleProfileClick = () => {
    navigate(`/profile/${receiverId}`); // Naviger til profil-siden
  };

  if (loading) return <div className="text-white">Loading...</div>;

  return (
    <div className="mt-auto flex-grow items-start w-full h-full">
      <div className="bg-gray-800 shadow-lg rounded-lg p-8 h-full flex flex-col">
        <div className="flex items-center justify-between bg-gray-600 p-4 rounded-md">
          {/* Back button using loggedInUserId */}
          <button
            onClick={() => navigate(`/conversation/${loggedInUserId}`)} // Naviger til en spesifikk side basert på loggedInUserId
            className="text-white text-4xl"
          >
            ←
          </button>

          <h2 
            className="text-2xl font-extrabold text-white mr-4 cursor-pointer hover:underline ml-auto"
            onClick={handleProfileClick} // Legg til klikk-håndtering her
          >
            {receiverUsername}
          </h2>
        </div>

        <div
          className="flex-grow space-y-4 overflow-y-auto mt-4 post-textarea-grey"
          style={{
            paddingRight: '5px', // Forhindre at innhold blir kuttet av av scrollbar
          }}
        >
          {messages.length > 0 ? (
            messages.map((message) => (
              <div
                key={message.id}
                className={`mb-4 p-3 w-fit rounded-lg shadow ${
                  message.senderId === parseInt(senderId)
                    ? "bg-blue-500 text-white text-right ml-auto rounded-tl-2xl rounded-br-2xl" // Melding fra bruker1 (høyre)
                    : "bg-gray-300 text-black text-left rounded-tr-2xl rounded-bl-2xl" // Melding fra bruker2 (venstre)
                }`}
              >
                {/* Endre tekstfarge basert på bakgrunnsfargen */}
                <p className={`text-lg font-semibold ${
                  message.senderId === parseInt(senderId) ? "text-white" : "text-black"
                }`}>
                  {message.content}
                </p>

                <p className="text-xs">
                  {new Date(message.timestamp).toLocaleString()}
                </p>
              </div>
            ))
          ) : (
            <div className="text-gray-400 text-center">No messages yet</div>
          )}
          <div ref={messagesEndRef} /> {/* Tom div for å rulle til */}
        </div>

        <div className="bg-gray-700 p-4 border-t border-gray-600 mt-4 rounded-md">
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
  );
};

export default Messages;
