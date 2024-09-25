import React, { useState } from 'react';

const LeftNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeButton, setActiveButton] = useState(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleNavClick = (button) => {
    setActiveButton(button);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full md:w-1/6 bg-gray-900 text-white h-screen flex flex-col">
      <button 
        className="absolute top-4 left-4 md:hidden flex items-center p-2" 
        onClick={toggleMenu}
      >
        <span className="material-icons text-3xl">menu</span>
      </button>

      <h1 className="absolute top-4 left-0 right-0 text-5xl font-light text-center px-4">RAYS</h1> {/* Legg til padding her */}

      <nav className={`flex-col flex-grow ${isOpen ? 'flex' : 'hidden'} transition-all duration-300 md:flex mt-24`}>
        <div className="flex flex-col space-y-4 mb-2">
          {/* Home button */}
          <a 
            href="#" 
            className={`px-4 transition-colors duration-200 w-full ${activeButton === 'home' ? 'bg-gray-700' : ''}`}
            onClick={() => handleNavClick('home')}
          >
            <div className={`flex items-center space-x-4 rounded-lg py-4 ${activeButton === 'home' ? '' : 'hover:bg-gray-600'}`}>
              <span className="material-icons text-2xl pl-2">home</span>
              <span className="text-xl">Home</span>
            </div>
          </a>

          {/* Messages button */}
          <a 
            href="#" 
            className={`px-4 transition-colors duration-200 w-full ${activeButton === 'messages' ? 'bg-gray-700' : ''}`}
            onClick={() => handleNavClick('messages')}
          >
            <div className={`flex items-center space-x-4 rounded-lg py-4 ${activeButton === 'messages' ? '' : 'hover:bg-gray-600'}`}>
              <span className="material-icons text-2xl pl-2">message</span>
              <span className="text-xl">Messages</span>
            </div>
          </a>

          {/* People button */}
          <a 
            href="#" 
            className={`px-4 transition-colors duration-200 w-full ${activeButton === 'people' ? 'bg-gray-700' : ''}`}
            onClick={() => handleNavClick('people')}
          >
            <div className={`flex items-center space-x-4 rounded-lg py-4 ${activeButton === 'people' ? '' : 'hover:bg-gray-600'}`}>
              <span className="material-icons text-2xl pl-2">people</span>
              <span className="text-xl">People</span>
            </div>
          </a>

          {/* Saved button */}
          <a 
            href="#" 
            className={`px-4 transition-colors duration-200 w-full ${activeButton === 'saved' ? 'bg-gray-700' : ''}`}
            onClick={() => handleNavClick('saved')}
          >
            <div className={`flex items-center space-x-4 rounded-lg py-4 ${activeButton === 'saved' ? '' : 'hover:bg-gray-600'}`}>
              <span className="material-icons text-2xl pl-2">bookmark</span>
              <span className="text-xl">Saved</span>
            </div>
          </a>
        </div>
      </nav>
      
      <div className="flex flex-col space-y-4 mb-6">        
        {/* Logout button */}
        <a 
          href="#" 
          className={`px-4 transition-colors duration-200 w-full ${activeButton === 'logout' ? 'bg-gray-700' : ''}`}
          onClick={() => handleNavClick('logout')}
        >
          <div className={`flex items-center space-x-4 rounded-lg py-4 ${activeButton === 'logout' ? 'bg-gray-700' : ''} ${activeButton === 'logout' ? '' : 'hover:bg-gray-600'}`}>
            <span className="material-icons text-2xl pl-2">logout</span>
            <span className="text-xl">Logout</span>
          </div>
        </a>
      </div>
    </div>
  );
};

export default LeftNavbar;
