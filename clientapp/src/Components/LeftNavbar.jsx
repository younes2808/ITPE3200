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
    <div className="relative w-full md:w-2/12 bg-gray-900 text-white h-screen flex flex-col">
      <button 
        className="absolute top-4 left-4 md:hidden flex items-center p-2" 
        onClick={toggleMenu}
      >
        <span className="material-icons text-3xl">menu</span>
      </button>

      <h1 className="absolute top-4 left-0 right-0 text-5xl font-light text-center px-4">RAYS</h1>

      {/* Klikkbar profilseksjon */}
      <a 
        href="/profile"  // Dette vil navigere til profilsiden, du kan endre URL-en
        className="flex items-center p-4 mt-24 space-x-4 hover:bg-gray-800 rounded-lg transition-colors duration-200" // Økt margin-top
      >
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/4/41/Beetlejuice_onstage.jpg" // Her kan du legge inn URL-en til profilbildet
          alt="Profile" 
          className="w-12 h-12 rounded-full"
        />
        <div>
          <h2 className="text-lg font-semibold">BeetleJuice</h2>
          <p className="text-sm text-gray-400">@hehey</p>
        </div>
      </a>

      <nav className={`flex-col flex-grow ${isOpen ? 'flex' : 'hidden'} transition-all duration-300 md:flex mt-6`}>
        <div className="flex flex-col space-y-4 mb-2">
          {/* Home button */}
          <a 
            href="#" 
            className={`px-2 transition-colors duration-200 w-full ${activeButton === 'home' ? 'bg-gray-700' : ''}`} // Redusert padding
            onClick={() => handleNavClick('home')}
          >
            <div className={`flex items-center space-x-3 rounded-lg py-3 ${activeButton === 'home' ? '' : 'hover:bg-gray-600'}`}> {/* Redusert padding */}
              <span className="material-icons text-xl pl-2">home</span> {/* Redusert ikonstørrelse */}
              <span className="text-lg">Home</span> {/* Redusert tekststørrelse */}
            </div>
          </a>

          {/* Messages button */}
          <a 
            href="#" 
            className={`px-2 transition-colors duration-200 w-full ${activeButton === 'messages' ? 'bg-gray-700' : ''}`} // Redusert padding
            onClick={() => handleNavClick('messages')}
          >
            <div className={`flex items-center space-x-3 rounded-lg py-3 ${activeButton === 'messages' ? '' : 'hover:bg-gray-600'}`}> {/* Redusert padding */}
              <span className="material-icons text-xl pl-2">message</span> {/* Redusert ikonstørrelse */}
              <span className="text-lg">Messages</span> {/* Redusert tekststørrelse */}
            </div>
          </a>

          {/* People button */}
          <a 
            href="#" 
            className={`px-2 transition-colors duration-200 w-full ${activeButton === 'people' ? 'bg-gray-700' : ''}`} // Redusert padding
            onClick={() => handleNavClick('people')}
          >
            <div className={`flex items-center space-x-3 rounded-lg py-3 ${activeButton === 'people' ? '' : 'hover:bg-gray-600'}`}> {/* Redusert padding */}
              <span className="material-icons text-xl pl-2">people</span> {/* Redusert ikonstørrelse */}
              <span className="text-lg">People</span> {/* Redusert tekststørrelse */}
            </div>
          </a>

          {/* Saved button */}
          <a 
            href="#" 
            className={`px-2 transition-colors duration-200 w-full ${activeButton === 'saved' ? 'bg-gray-700' : ''}`} // Redusert padding
            onClick={() => handleNavClick('saved')}
          >
            <div className={`flex items-center space-x-3 rounded-lg py-3 ${activeButton === 'saved' ? '' : 'hover:bg-gray-600'}`}> {/* Redusert padding */}
              <span className="material-icons text-xl pl-2">bookmark</span> {/* Redusert ikonstørrelse */}
              <span className="text-lg">Saved</span> {/* Redusert tekststørrelse */}
            </div>
          </a>
        </div>
      </nav>

      <div className="flex flex-col space-y-4 mb-6">        
        {/* Logout button */}
        <a 
          href="#" 
          className={`px-2 transition-colors duration-200 w-full ${activeButton === 'logout' ? 'bg-gray-700' : ''}`} // Redusert padding
          onClick={() => handleNavClick('logout')}
        >
          <div className={`flex items-center space-x-3 rounded-lg py-3 ${activeButton === 'logout' ? 'bg-gray-700' : ''} ${activeButton === 'logout' ? '' : 'hover:bg-gray-600'}`}> {/* Redusert padding */}
            <span className="material-icons text-xl pl-2">logout</span> {/* Redusert ikonstørrelse */}
            <span className="text-lg">Logout</span> {/* Redusert tekststørrelse */}
          </div>
        </a>
      </div>
    </div>
  );
};

export default LeftNavbar;                                                                                                               
