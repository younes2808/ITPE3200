import React, { useRef } from 'react';
import TopBar from './../Components/TopBar';
import RightNavbar from './../Components/RightNavbar';
import LeftNavbar from './../Components/LeftNavbar';
import BottomNavbar from './../Components/BottomNavbar';
import FriendRequests from "../Components/FriendRequests"; // Juster importbanen etter behov

const ConversationPage = () => {
  const scrollRef = useRef(null);
  return (
    <div className="bg-orange-500 flex h-screen flex-col overflow-y-auto">
      {/* Top Bar */}
      <TopBar />

      {/* Hovedcontainer */}
        {/* Justert container med dynamisk margin og max-w for å sikre plass til navbarene */}
        <div className="flex w-full max-w-[1300px] mx-auto">

          {/* Left Navbar - plasseres på venstre side */}
          <div className="flex-none"> 
            <LeftNavbar />
          </div>

          {/* Post og feed-seksjonen i midten */}
          <div className="flex-grow bg-gray-100 510px:p-4 h-screen overflow-y-auto 300px:pb-16 300px:pt-20 300px:pl-6 300px:pr-6 510px:pl-24 510px:pr-5 580px:pr-10 md:pl-44 md:pr-16 870px:pl-48 870px:pr-16 970px:pr-16 1150px:pl-64 1150px:pr-12">
            <FriendRequests />
          </div>

          {/* Right Navbar - plasseres på høyre side */}
          <div className="flex-none"> 
            <RightNavbar />
          </div>
        </div>

      {/* Bottom Navbar */}
      <BottomNavbar />
    </div>
  );
};

export default ConversationPage;
