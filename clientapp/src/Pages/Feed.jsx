import React from 'react'
import RightNavbar from './../Components/RightNavbar';
import LeftNavbar from './../Components/LeftNavbar';
import PostFunction from './../Components/Post'

const Feed = () => {
  return (
    <div className="flex h-screen">
    {/* Left Navbar */}
    <LeftNavbar />
    <div className="w-4/6 bg-gray-100 p-6 flex justify-center items-center">
    {/* Post */}
    <PostFunction />
    </div>
    {/* Right Navbar */}
    <RightNavbar />
    </div>
  )
}

export default Feed