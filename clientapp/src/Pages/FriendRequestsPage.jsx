import React, { useRef } from 'react'; // Import React and useRef hook
import TopBar from './../Components/TopBar'; // Import TopBar component
import RightNavbar from './../Components/RightNavbar'; // Import RightNavbar component
import LeftNavbar from './../Components/LeftNavbar'; // Import LeftNavbar component
import BottomNavbar from './../Components/BottomNavbar'; // Import BottomNavbar component
import FriendRequests from "../Components/FriendRequests"; // Import FriendRequests component

const ConversationPage = () => {
  const scrollRef = useRef(null); // Create a ref to manage scrolling

  return (
    <div className="bg-gray-100 flex h-screen flex-col overflow-y-auto">
      {/* Top Bar */}
      <TopBar scrollContainer={scrollRef} /> {/* Render TopBar and pass scrollRef */}

      {/* Main container */}
      {/* Adjusted container with dynamic margins and max width for space for navbars */}
      <div className="flex w-full max-w-[1200px] mx-auto h-screen">

        {/* Left Navbar - placed on the left */}
        <div className="flex-none"> 
          <LeftNavbar /> {/* Render LeftNavbar */}
        </div>

        {/* Friend section in the middle */}
        <div className="flex-grow bg-gray-100 510px:p-4 h-screen overflow-y-auto 300px:pb-16 300px:pt-20 300px:pl-6 300px:pr-6 510px:pl-24 510px:pr-5 580px:pr-10 md:pl-44 md:pr-16 870px:pl-48 870px:pr-16 970px:pr-16 1150px:pl-64 1150px:pr-12">
          <FriendRequests /> {/* Render FriendRequests component */}
        </div>

        {/* Right Navbar */}
        <div className="flex-none"> 
          <RightNavbar /> {/* Render RightNavbar */}
        </div>
      </div>

      {/* Bottom Navbar */}
      <BottomNavbar /> {/* Render BottomNavbar */}
    </div>
  );
};

export default ConversationPage; // Export the ConversationPage component
