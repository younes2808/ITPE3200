import React from 'react';
import { useNavigate } from "react-router-dom";

const BottomNavbar = () => {
  const navigate = useNavigate();

  const handleNavClick = (route) => {
    navigate(route);
  };

  return (
    <div className="fixed bottom-0 w-full bg-gray-900 text-white flex justify-around py-3 510px:hidden">
      {/* Bunn-navigasjonsmeny for skjermer mindre enn 510px */}
      <a
        onClick={() => handleNavClick("/feed")}
        className="flex flex-col items-center cursor-pointer"
      >
        <span className="material-icons text-3xl">home</span>
      </a>
      <a
        onClick={() => handleNavClick("/messages")}
        className="flex flex-col items-center cursor-pointer"
      >
        <span className="material-icons text-3xl">message</span>
      </a>
      <a
        onClick={() => handleNavClick("/people")}
        className="flex flex-col items-center cursor-pointer relative"
      >
        <span className="material-icons text-3xl">people</span>
      </a>
      <a
        onClick={() => handleNavClick("/saved")}
        className="flex flex-col items-center cursor-pointer"
      >
        <span className="material-icons text-3xl">search</span>
      </a>
      <a
        onClick={() => handleNavClick("/profile")}
        className="flex flex-col items-center cursor-pointer"
      >
        <span className="material-icons text-3xl">logout</span>
      </a>
    </div>
  );
};

export default BottomNavbar;
