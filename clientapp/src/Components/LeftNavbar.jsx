import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

const LeftNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
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
     // Oppdater activeButton basert på gjeldende rute
     if (location.pathname === '/feed') {
      setActiveButton('home');
    } else if (location.pathname.startsWith('/conversation')) {
      setActiveButton('messages');
    } else if (location.pathname === '/friend-requests') {
      setActiveButton('people');
    } else if (location.pathname === '/search') {
      setActiveButton('search');
    }
  }, [location]);

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
    <div className="fixed w-full hidden 200px:w-8 510px:w-16 510px:items-center md:items-start md:w-32 870px:w-36 1150px:w-52 bg-white text-black h-screen 510px:flex flex-col border-l-2 border-r-2 border-gray-200">
      <h1 className="hidden absolute top-4 pt-3 left-0 right-0 text-3xl 510px:block 510px:text-xl md:text-3xl 870px:text-4xl 1150px:text-5xl font-light text-center px-2">RAYS</h1>

      {/* Clickable Profile Section */}
      <a 
        href={`/profile/${userId}`}
        className="flex items-center space-x-0 pt-8 p-4 mt-24 md:space-x-4  hover:bg-emerald-50 rounded-lg transition-colors duration-200 w-full"
      >
        <div className="flex items-center justify-center w-10 h-10 md:w-14 md:h-10 870px:w-16 870px:h-12 1150px:w-16 1150px:h-16 rounded-full bg-emerald-200"> {/* Use a colored circle */}
          <span className="text-2xl 870px:text-3xl 1150px:text-4xl font-semibold">{username.charAt(0).toUpperCase()}</span> {/* Display the first letter of the username */}
        </div>
        <div>
          <h2 className="text-xs hidden md:-ml-2 md:inline 870px:-ml-0 870px:text-sm 1150px:text-lg font-lexend font-normal">{username}</h2>  {/* Use the dynamic username */}
          <br/>
          <p className="text-xs hidden md:-ml-2 md:inline 870px:-ml-0 870px:text-xs 1150px:text-md font-clash text-gray-400">@{username.toLowerCase()}</p>  {/* Assuming you want the username as the handle */}
        </div>
      </a>

      {/* Navigation Menu */}
      <nav className="flex-col flex-grow transition-all duration-300 mt-6 w-full">
        <div className="flex flex-col space-y-4 mb-2">
          <a 
            href='#/' 
            className={`px-2 transition-colors duration-200 ${activeButton === 'home' ? 'border-b-2 border-emerald-200 border-t-2 bg-emerald-50 font-semibold' : '510px:hover:bg-emerald-100 md:hover:bg-emerald-100'}`} 
            onClick={() => handleNavClick('home')}
          >
            <div className="flex items-center space-x-3 rounded-lg py-2 870px:py-3">
              <span className="material-icons text-3xl md:text-lg 870px:text-2xl pl-2">home</span>
              <span className="text-sm 870px:text-lg hidden md:inline transition duration-300 ease-in-out">
                Home
              </span>
            </div>
          </a>

          <a  
            href='#/' 
            className={`px-2 transition-colors duration-200 ${activeButton === 'messages' ? 'border-b-2 border-emerald-300 border-t-2 bg-emerald-50 font-semibold' : '510px:hover:bg-emerald-100 md:hover:bg-emerald-100'}`} 
            onClick={() => handleNavClick('messages')}
          >
            <div className="flex items-center space-x-3 rounded-lg py-2 870px:py-3">
              <span className="material-icons text-3xl md:text-lg 870px:text-2xl pl-2">message</span>
              <span className="text-sm 870px:text-lg hidden md:inline transition duration-300 ease-in-out">
                Messages
              </span>
            </div>
          </a>


          <a  
            href='#/' 
            className={`px-2 transition-colors duration-200 ${activeButton === 'people' ? 'border-b-2 border-emerald-300 border-t-2 bg-emerald-50 font-semibold' : '510px:hover:bg-emerald-100 md:hover:bg-emerald-100'}`} 
            onClick={() => handleNavClick('people')}
          >
            <div className="flex items-center space-x-3 rounded-lg py-2 870px:py-3">
              <span className="material-icons text-3xl md:text-lg 870px:text-2xl pl-2">people</span>
              <span className="text-sm 870px:text-lg hidden md:inline transition duration-300 ease-in-out">
                Requests
              </span>
            </div>
          </a>


          <a  
            href='#/' 
            className={`px-2 transition-colors duration-200 ${activeButton === 'search' ? 'border-b-2 border-emerald-300 border-t-2 bg-emerald-50 font-semibold' : '510px:hover:bg-emerald-100 md:hover:bg-emerald-100'}`} 
            onClick={() => handleNavClick('search')}
          >
            <div className="flex items-center space-x-3 rounded-lg py-2 870px:py-3">
              <span className="material-icons text-3xl md:text-lg 870px:text-2xl pl-2">search</span>
              <span className="text-sm 870px:text-lg hidden md:inline transition duration-300 ease-in-out">
                Search
              </span>
            </div>
          </a>

          <a  
            href='#/' 
            className={`px-2 transition-colors duration-200 ${activeButton === 'logout' ? 'border-b-2 border-emerald-300 border-t-2 bg-emerald-50 font-semibold' : '510px:hover:bg-emerald-100 md:hover:bg-emerald-100'}`} 
            onClick={() => handleNavClick('logout')}
          >
            <div className="flex items-center space-x-3 rounded-lg py-2 870px:py-3 w-full">
              <span className="material-icons text-3xl md:text-lg 870px:text-2xl pl-2">logout</span>
              <span className="text-sm 870px:text-lg hidden md:inline transition duration-300 ease-in-out">
                Logout
              </span>
            </div>
          </a>

        </div>
      </nav>       
     


      
    </div>
  );
};

export default LeftNavbar;
