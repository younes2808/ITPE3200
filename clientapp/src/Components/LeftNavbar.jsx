import React, { useState } from 'react'; 
import { useNavigate } from "react-router-dom";

const LeftNavbar = () => {
  const navigate = useNavigate(); // Flytt inn i komponenten
  const [activeButton, setActiveButton] = useState(null);

  const handleNavClick = (button) => {
    setActiveButton(button);

    // Naviger til riktig rute basert på knappen som klikkes
    switch (button) {
      case 'home':
        navigate("/feed");
        break;
      case 'messages':
        navigate("/messages"); // Bytt ut med riktig rute
        break;
      case 'people':
        navigate("/people"); // Bytt ut med riktig rute
        break;
      case 'saved':
        navigate("/saved"); // Bytt ut med riktig rute
        break;
      case 'logout':
        sessionStorage.removeItem("user")
        navigate("/")
        break;
      default:
        break;
    }
  };

  return (
    <div className="fixed w-full 500px:w-32 870px:w-36 lg:w-52 bg-gray-900 text-white h-screen flex flex-col">
      <h1 className="absolute top-4 left-0 right-0 text-4xl 870px:text-3xl font-light text-center px-4">RAYS</h1>

      {/* Klikkbar profilseksjon */}
      <a 
        href="/profile"
        className="flex items-center p-4 mt-24 space-x-4 hover:bg-gray-800 rounded-lg transition-colors duration-200"
      >
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/4/41/Beetlejuice_onstage.jpg" 
          alt="Profile" 
          className="w-10 h-10 870px:w-12 870px:h-12 rounded-full"
        />
        <div>
          <h2 className="text-md 870px:text-lg font-semibold">BeetleJuice</h2>
          <p className="text-sm 870px:text-md text-gray-400">@hehey</p>
        </div>
      </a>

      {/* Navigasjonsmeny */}
      <nav className="flex-col flex-grow transition-all duration-300 mt-6">
        <div className="flex flex-col space-y-4 mb-2">
          {/* Home button */}
          <a 
            href='#/'
            className={`px-2 transition-colors duration-200 w-full ${activeButton === 'home' ? 'bg-gray-700' : ''}`} 
            onClick={() => handleNavClick('home')} // Endret her
          >
            <div className={`flex items-center space-x-3 rounded-lg py-2 870px:py-3 ${activeButton === 'home' ? '' : 'hover:bg-gray-600'}`}>
              <span className="material-icons text-lg 870px:text-xl pl-2">home</span>
              <span className="text-sm 870px:text-lg hidden md:inline">Home</span>
            </div>
          </a>

          {/* Messages button */}
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

          {/* People button */}
          <a 
            href="#/" 
            className={`px-2 transition-colors duration-200 w-full ${activeButton === 'people' ? 'bg-gray-700' : ''}`} 
            onClick={() => handleNavClick('people')}
          >
            <div className={`flex items-center space-x-3 rounded-lg py-2 870px:py-3 ${activeButton === 'people' ? '' : 'hover:bg-gray-600'}`}>
              <span className="material-icons text-lg 870px:text-xl pl-2">people</span>
              <span className="text-sm 870px:text-lg hidden md:inline">People</span>
            </div>
          </a>

          {/* Saved button */}
          <a 
            href="#/" 
            className={`px-2 transition-colors duration-200 w-full ${activeButton === 'saved' ? 'bg-gray-700' : ''}`} 
            onClick={() => handleNavClick('saved')}
          >
            <div className={`flex items-center space-x-3 rounded-lg py-2 870px:py-3 ${activeButton === 'saved' ? '' : 'hover:bg-gray-600'}`}>
              <span className="material-icons text-lg 870px:text-xl pl-2">bookmark</span>
              <span className="text-sm 870px:text-lg hidden md:inline">Saved</span>
            </div>
          </a>
        </div>
      </nav>

      <div className="flex flex-col space-y-4 mb-6">        
        {/* Logout button */}
        <a 
          href="#/" 
          className={`px-2 transition-colors duration-200 w-full ${activeButton === 'logout' ? 'bg-gray-700' : ''}`} 
          onClick={() => handleNavClick('logout')}
        >
          <div className={`flex items-center space-x-3 rounded-lg py-2 870px:py-3 ${activeButton === 'logout' ? 'bg-gray-700' : ''} ${activeButton === 'logout' ? '' : 'hover:bg-gray-600'}`}>
            <span className="material-icons text-lg 870px:text-xl pl-2">logout</span>
            <span className="text-sm 870px:text-lg hidden md:inline">Logout</span>
          </div>
        </a>
      </div>
    </div>
  );
};

export default LeftNavbar;