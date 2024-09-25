import React from 'react'
import RightNavbar from './../Components/RightNavbar';
import LeftNavbar from './../Components/LeftNavbar';

const Feed = () => {
  return (
    <div className="flex h-screen">
    {/* Left Navbar */}
    <LeftNavbar />
    {/* Main content */}
    <div className="w-4/6 bg-gray-100 p-6 flex justify-center items-center">
      <div className="text-center text-2xl font-semibold">Main content</div>
    </div>
    {/* Right Navbar */}
    <RightNavbar />
    </div>
  )
}

export default Feed