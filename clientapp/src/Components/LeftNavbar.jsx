import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

const LeftNavbar = () => {
  const navigate = useNavigate();
  const [activeButton, setActiveButton] = useState(null);
  const [userId, setUserId] = useState(null); // Store the userId from sessionStorage
  const [username, setUsername] = useState(''); // State to store username

  useEffect(() => {
    // Get user information from sessionStorage
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserId(user.id); // Store the userId in state
      setUsername(user.username); // Set username
    }
  }, []);

  const handleNavClick = (button) => {
    setActiveButton(button);
    switch (button) {
      case 'home':
        navigate("/feed");
        break;
      case 'messages':
        // Navigate to the conversation page with the userId
        if (userId) {
          navigate(`/conversation/${userId}`);
        }
        break;
      case 'people':
        navigate("/friend-requests");
        break;
      case 'search':
        navigate("/search");
        break;
      case 'logout':
        sessionStorage.removeItem("user");
        navigate("/");
        break;
      default:
        break;
    }
  };

  return (
    <div className="fixed w-full 500px:w-32 870px:w-36 lg:w-52 bg-gray-900 text-white h-screen flex flex-col">
      <h1 className="absolute top-4 left-0 right-0 text-4xl 870px:text-3xl font-light text-center px-4">RAYS</h1>

      {/* Clickable Profile Section */}
      <a 
        href={`/profile/${userId}`}
        className="flex items-center p-4 mt-24 space-x-4 hover:bg-gray-800 rounded-lg transition-colors duration-200"
      >
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500"> {/* Use a colored circle */}
          <span className="text-lg font-semibold">{username.charAt(0).toUpperCase()}</span> {/* Display the first letter of the username */}
        </div>
        <div>
          <h2 className="text-md 870px:text-lg font-semibold">{username}</h2>  {/* Use the dynamic username */}
          <p className="text-sm 870px:text-md text-gray-400">@{username.toLowerCase()}</p>  {/* Assuming you want the username as the handle */}
        </div>
      </a>

      {/* Navigation Menu */}
      <nav className="flex-col flex-grow transition-all duration-300 mt-6">
        <div className="flex flex-col space-y-4 mb-2">
          <a 
            href='#/' 
            className={`px-2 transition-colors duration-200 w-full ${activeButton === 'home' ? 'bg-gray-700' : ''}`} 
            onClick={() => handleNavClick('home')}
          >
            <div className={`flex items-center space-x-3 rounded-lg py-2 870px:py-3 ${activeButton === 'home' ? '' : 'hover:bg-gray-600'}`}>
              <span className="material-icons text-lg 870px:text-xl pl-2">home</span>
              <span className="text-sm 870px:text-lg hidden md:inline">Home</span>
            </div>
          </a>

          <a 
            href="#/" 
            className={`px-2 transition-colors duration-200 w-full ${activeButton === 'messages' ? 'bg-gray-700' : ''}`} 
            onClick={() => handleNavClick('messages')}
          >
            <div className={`flex items-center space-x-3 rounded-lg py-2 870px:py-3 ${activeButton === 'messages' ? '' : 'hover:bg-gray-600'}`}>
              <span className="material-icons text-lg 870px:text-xl pl-2">message</span>
              <span className="text-sm 870px:text-lg hidden md:inline">Messages</span>
            </div>
          </a>

          <a 
            href="#/" 
            className={`px-2 transition-colors duration-200 w-full ${activeButton === 'people' ? 'bg-gray-700' : ''}`} 
            onClick={() => handleNavClick('people')}
          >
            <div className={`flex items-center space-x-3 rounded-lg py-2 870px:py-3 ${activeButton === 'people' ? '' : 'hover:bg-gray-600'}`}>
              <span className="material-icons text-lg 870px:text-xl pl-2">people</span>
              <span className="text-sm 870px:text-lg hidden md:inline">Requests</span>
            </div>
          </a>

          <a 
            href="#/" 
            className={`px-2 transition-colors duration-200 w-full ${activeButton === 'saved' ? 'bg-gray-700' : ''}`} 
            onClick={() => handleNavClick('search')}
          >
            <div className={`flex items-center space-x-3 rounded-lg py-2 870px:py-3 ${activeButton === 'saved' ? '' : 'hover:bg-gray-600'}`}>
              <span className="material-icons text-lg 870px:text-xl pl-2">search</span>
              <span className="text-sm 870px:text-lg hidden md:inline">Search</span>
            </div>
          </a>
        </div>
      </nav>

      <div className="flex flex-col space-y-4 mb-6">        
        <a 
          href="#/" 
          className={`px-2 transition-colors duration-200 w-full ${activeButton === 'logout' ? 'bg-gray-700' : ''}`} 
          onClick={() => handleNavClick('logout')}
        >
          <div className={`flex items-center space-x-3 rounded-lg py-2 870px:py-3 ${activeButton === 'logout' ? '' : 'hover:bg-gray-600'}`}>
            <span className="material-icons text-lg 870px:text-xl pl-2">logout</span>
            <span className="text-sm 870px:text-lg hidden md:inline">Logout</span>
          </div>
        </a>
      </div>
    </div>
  );
};

export default LeftNavbar;
