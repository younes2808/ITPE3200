import React from 'react';
import LeftNavbar from '../Components/LeftNavbar'; 
import SearchUsers from '../Components/SearchUsers'; // Import UserPost component
import RightNavbar from '../Components/RightNavbar';

const Search = () => {
  return (
    <div className="bg-gray-100 flex h-screen">
    {/* Left Navbar */}
    <LeftNavbar />
    
    {/* Comments */}
    <div className="w-full bg-gray-100 p-6 flex justify-center items-center">
    <SearchUsers />
    </div>

    {/* Right Navbar */}
    <RightNavbar />
  </div>
  )
}

export default Search