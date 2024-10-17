import React from 'react';
import LeftNavbar from '../Components/LeftNavbar'; 
import SearchUsers from '../Components/SearchUsers'; // Import UserPost component
import RightNavbar from '../Components/RightNavbar';
import TopBar from './../Components/TopBar';
import BottomNavbar from './../Components/BottomNavbar';

const Search = () => {
  return (
    <div className="bg-gray-800 flex h-screen flex-col overflow-y-auto">
      {/* Top Bar */}
      <TopBar />

      {/* Hovedcontainer */}
        {/* Justert container med dynamisk margin og max-w for å sikre plass til navbarene */}
        <div className="flex w-full max-w-[1300px] mx-auto h-full border-l-2 border-r-2 border-gray-700">

          {/* Left Navbar - plasseres på venstre side */}
          <div className="flex-none"> 
            <LeftNavbar />
          </div>

          {/* Search i midten */}
          <div className="flex-grow bg-gray-900 p-6 overflow-y-auto w-full 400px:pl-6 scrollbar-none 510px:pl-24 510px:pr-5 580px:pr-10 md:pl-44 md:pr-16 870px:pl-48 870px:pr-20 970px:pr-16 1150px:pl-64 1150px:pr-10">
          <SearchUsers />
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