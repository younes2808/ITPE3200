import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

const BottomNavbar = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null); // Store the userId from sessionStorage

  useEffect(() => {
    // Get user information from sessionStorage
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserId(user.id); // Store the userId in state
    }
  }, []);

  const handleNavClick = (button) => {
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
    <div className="fixed bottom-0 w-full bg-gray-900 text-white flex justify-around py-3 510px:hidden">
      {/* Bottom navigation menu for screens smaller than 510px */}
      <a
        href='#/'
        onClick={() => handleNavClick("home")}
        className="flex flex-col items-center cursor-pointer"
      >
        <span className="material-icons text-3xl">home</span>
      </a>
      <a
        href='#/'
        onClick={() => handleNavClick("messages")}
        className="flex flex-col items-center cursor-pointer"
      >
        <span className="material-icons text-3xl">message</span>
      </a>
      <a
        href='#/'
        onClick={() => handleNavClick("people")}
        className="flex flex-col items-center cursor-pointer"
      >
        <span className="material-icons text-3xl">people</span>
      </a>
      <a
        href='#/'
        onClick={() => handleNavClick("search")}
        className="flex flex-col items-center cursor-pointer"
      >
        <span className="material-icons text-3xl">search</span>
      </a>
      <a
        href='#/'
        onClick={() => handleNavClick("logout")}
        className="flex flex-col items-center cursor-pointer"
      >
        <span className="material-icons text-3xl">logout</span>
      </a>
    </div>
  );
};

export default BottomNavbar;
