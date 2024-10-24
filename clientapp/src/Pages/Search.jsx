import React, { useRef } from 'react';
import LeftNavbar from '../Components/LeftNavbar'; 
import UserSearch from '../Components/SearchUsers'; // Import UserPost component
import RightNavbar from '../Components/RightNavbar';
import TopBar from './../Components/TopBar';
import BottomNavbar from './../Components/BottomNavbar';

const Search = () => {
  const scrollRef = useRef(null);
  return (
    <div className="bg-gray-100 border flex h-screen flex-col overflow-y-auto">
      {/* Top Bar */}
      <TopBar scrollContainer={scrollRef}/>

      {/* Hovedcontainer */}
        {/* Justert container med dynamisk margin og max-w for å sikre plass til navbarene */}
        <div className="flex w-full max-w-[1200px] mx-auto h-full">

          {/* Left Navbar - plasseres på venstre side */}
          <div className="flex-none"> 
            <LeftNavbar />
          </div>

          {/* Search i midten */}

          <div ref={scrollRef} className="flex-grow bg-gray-100 510px:p-4 h-screen overflow-y-auto 300px:pb-16 300px:pt-20 300px:pl-6 300px:pr-6 510px:pl-24 510px:pr-5 580px:pr-10 md:pl-44 md:pr-16 870px:pl-48 870px:pr-16 970px:pr-16 1150px:pl-64 1150px:pr-12">
          <UserSearch />
            
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
}

export default Search