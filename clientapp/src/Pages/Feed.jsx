import React from 'react';
import TopBar from './../Components/TopBar';
import RightNavbar from './../Components/RightNavbar';
import LeftNavbar from './../Components/LeftNavbar';
import BottomNavbar from './../Components/BottomNavbar';
import PostFunction from './../Components/Post';
import PostFeed from './../Components/PostFeed';

const Feed = () => {
  return (
    <div className="bg-orange-500 flex h-screen flex-col overflow-y-auto"> {/* flex-col for å justere vertikalt */}
      {/* Top Bar */}
      <TopBar /> 

      {/* Hovedcontainer */}
      <div className="flex flex-grow justify-center"> {/* justify-center holder elementene sentrert */}
        
        {/* Bruk en container med dynamisk margin for skjermbredde over 1400px */}
        <div className="flex w-full max-w-[1300px] mx-auto"> 
          
          {/* Left Navbar - plasseres på venstre side og forblir der */}
          <div className="flex-none">
            <LeftNavbar />
          </div>

          {/* Post og feed-seksjonen i midten */}
          <div className="flex-grow bg-gray-100 p-6 overflow-y-auto w-full 400px:pl-6 400px:pr-6 510px:pl-24 md:pl-44 870px:pl-48 870px:pr-16 970px:pr-56 lg:pl-64 lg:pr-56 1150px:pl-72 1150px:pr-72">
            <PostFunction />
            <PostFeed />
          </div>

          {/* Right Navbar - plasseres på høyre side og forblir der */}
          <div className="flex-none">
            <RightNavbar />
          </div>
        </div>
      </div>

      {/* Bottom Navbar */}
      <BottomNavbar /> 
    </div>
  );
};

export default Feed;
