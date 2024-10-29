import React, { useRef } from 'react';
import LeftNavbar from './../Components/LeftNavbar'; 
import Messages from './../Components/Messages'; // Import UserPost component
import RightNavbar from './../Components/RightNavbar';
import TopBar from './../Components/TopBar';
import BottomNavbar from './../Components/BottomNavbar';

const Search = () => {
  const scrollRef = useRef(null);
  return (
    <div className="bg-gray-100 flex h-screen flex-col overflow-y-auto">
      {/* Top Bar */}
      <TopBar scrollContainer={scrollRef}/>

      {/* main container */}
        {/* container with dynamic margin and sized to fit the navbar on the sides */}
        <div className="flex w-full max-w-[1200px] mx-auto bg-gray-100 h-screen">

          {/* Left Navbar - placed on the left */}
          <div className="flex-none"> 
            <LeftNavbar />
          </div>

          {/* Messages in the middle */}
          <div className="flex-grow bg-gray-100 510px:p-4 h-screen overflow-y-auto 300px:pb-16 300px:pt-20 300px:pl-6 300px:pr-6 510px:pl-24 510px:pr-5 580px:pr-10 md:pl-44 md:pr-16 870px:pl-48 870px:pr-16 970px:pr-16 1150px:pl-64 1150px:pr-12">
          <Messages />
          </div>

          {/* Right Navbar - placed on the right */}
          <div className="flex-none"> 
            <RightNavbar />
          </div>
        </div>

      {/* Bottom Navbar */}
      <BottomNavbar />
    </div>
  );
}

export default Search