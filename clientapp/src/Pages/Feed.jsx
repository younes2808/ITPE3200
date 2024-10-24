import React, { useRef } from 'react';
import TopBar from './../Components/TopBar';
import RightNavbar from './../Components/RightNavbar';
import LeftNavbar from './../Components/LeftNavbar';
import BottomNavbar from './../Components/BottomNavbar';
import PostFunction from './../Components/Post';
import PostFeed from './../Components/PostFeed';

const Feed = () => {
  const scrollRef = useRef(null); // Oppretter en ref for scrolling container

  return (
    <div className="bg-orange-500 flex h-screen flex-col">
      {/* Top Bar */}
      <TopBar scrollContainer={scrollRef} /> {/* Sender ref til TopBar */}

      {/* Hovedcontainer */}
      <div className="flex w-full max-w-[1300px] mx-auto bg-blue-500 h-full">

        {/* Left Navbar - plasseres på venstre side */}
        <div className="flex-none"> 
          <LeftNavbar />
        </div>

        {/* Post og feed-seksjonen i midten */}
        <div 
          ref={scrollRef} 
          className="flex-grow bg-gray-100 p-6 overflow-y-auto w-full 300px:mb-12 510px:mb-0 400px:pl-6 400px:pr-6 510px:pl-24 510px:pr-5 580px:pr-10 md:pl-44 md:pr-16 870px:pl-48 870px:pr-20 970px:pr-16 1150px:pl-64 1150px:pr-14"
        >
          <PostFunction />
          <PostFeed />
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

export default Feed;
