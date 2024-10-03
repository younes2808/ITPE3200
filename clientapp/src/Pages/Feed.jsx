import React from 'react'
import RightNavbar from '../Components/RightNavbar';
import LeftNavbar from '../Components/LeftNavbar';
import PostFunction from './../Components/Post'
import PostFeed from './../Components/PostFeed';

const Feed = () => {
  return (
    <div className=" bg-gray-100 flex h-screen">
    {/* Left Navbar */}
    <LeftNavbar />
    {/* Post */}
    <div className="w-4/6 bg-gray-100 p-6 flex justify-center items-center">
    <PostFunction />
    <PostFeed />
    {/* Right Navbar */}
    </div>
    <RightNavbar />
    </div>
  )
}

export default Feed