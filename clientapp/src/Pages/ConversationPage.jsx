import React, { useRef } from 'react'; // Import React and useRef hook
import TopBar from './../Components/TopBar'; // Import TopBar component
import RightNavbar from './../Components/RightNavbar'; // Import RightNavbar component
import LeftNavbar from './../Components/LeftNavbar'; // Import LeftNavbar component
import BottomNavbar from './../Components/BottomNavbar'; // Import BottomNavbar component
import Conversations from "../Components/Conversations"; // Import Conversations component to display conversation list

const ConversationPage = () => {
  const scrollRef = useRef(null); // Create a ref for scrolling functionality

  return (
    <div className="bg-gray-100 flex h-screen flex-col overflow-y-auto">
      {/* Top Bar */}
      <TopBar scrollContainer={scrollRef}/> {/* Pass the ref to TopBar for scrolling */}

      {/* Main container */}
      <div className="flex w-full max-w-[1200px] mx-auto h-screen">

        {/* Left Navbar - placed on the left side */}
        <div className="flex-none"> 
          <LeftNavbar /> {/* Render LeftNavbar for navigation */}
        </div>

        {/* Conversations section in the middle */}
        <div className="flex-grow bg-gray-100 510px:p-4 h-screen overflow-y-auto 300px:pb-16 300px:pt-20 300px:pl-6 300px:pr-6 510px:pl-24 510px:pr-5 580px:pr-10 md:pl-44 md:pr-16 870px:pl-48 870px:pr-16 970px:pr-16 1150px:pl-64 1150px:pr-12">
          <Conversations /> {/* Render Conversations component to display active conversations */}
        </div>

        {/* Right Navbar - placed on the right side */}
        <div className="flex-none"> 
          <RightNavbar /> {/* Render RightNavbar for additional options */}
        </div>
      </div>

      {/* Bottom Navbar */}
      <BottomNavbar /> {/* Render BottomNavbar for navigation */}
    </div>
  );
};

export default ConversationPage; // Export the ConversationPage component
