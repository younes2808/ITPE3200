import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";

const BottomNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Get the current location
  const [userId, setUserId] = useState(null); // Store the userId from sessionStorage
  const [activeButton, setActiveButton] = useState('home'); // Default active button

  useEffect(() => {
    // Get user information from sessionStorage
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserId(user.id); // Store the userId in state
    }

    // Update the active button based on the current location
    const path = location.pathname;
    if (path === '/feed') {
      setActiveButton('home');
    } else if (path.startsWith('/conversation')) {
      setActiveButton('messages');
    } else if (path === '/friend-requests') {
      setActiveButton('people');
    } else if (path === '/search') {
      setActiveButton('search');
    } else {
      setActiveButton('logout'); // Assuming logout is the default
    }
  }, [location, userId]); // Re-run effect when location or userId changes

  const handleNavClick = (button) => {
    setActiveButton(button); // Set the active button
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
    <div className="fixed bottom-0 w-full bg-white text-black flex justify-around py-3 510px:hidden">
      {/* Bottom navigation menu for screens smaller than 510px */}
      <a
        href="#/"
        onClick={() => handleNavClick("home")}
        className={`flex flex-col items-center cursor-pointer transition-colors duration-200 ${activeButton === 'home' ? 'border-l-2 border-emerald-300 border-r-2 bg-emerald-50' : 'hover:bg-emerald-100'}`}
      >
        <span className="material-icons text-3xl">home</span>
      </a>
      <a
        href="#/"
        onClick={() => handleNavClick("messages")}
        className={`flex flex-col items-center cursor-pointer transition-colors duration-200 ${activeButton === 'messages' ? 'border-l-2 border-emerald-300 border-r-2 bg-emerald-50' : 'hover:bg-emerald-100'}`}
      >
        <span className="material-icons text-3xl">message</span>
      </a>
      <a
        href="#/"
        onClick={() => handleNavClick("people")}
        className={`flex flex-col items-center cursor-pointer transition-colors duration-200 ${activeButton === 'people' ? 'border-l-2 border-emerald-300 border-r-2 bg-emerald-50' : 'hover:bg-emerald-100'}`}
      >
        <span className="material-icons text-3xl">people</span>
      </a>
      <a
        href="#/"
        onClick={() => handleNavClick("search")}
        className={`flex flex-col items-center cursor-pointer transition-colors duration-200 ${activeButton === 'search' ? 'border-l-2 border-emerald-300 border-r-2 bg-emerald-50' : 'hover:bg-emerald-100'}`}
      >
        <span className="material-icons text-3xl">search</span>
      </a>
      <a
        href="#/"
        onClick={() => handleNavClick("logout")}
        className={`flex flex-col items-center cursor-pointer transition-colors duration-200 ${activeButton === 'logout' ? 'border-l-2 border-emerald-300 border-r-2 bg-emerald-50' : 'hover:bg-emerald-100'}`}
      >
        <span className="material-icons text-3xl">logout</span>
      </a>
    </div>
  );
};

export default BottomNavbar;
