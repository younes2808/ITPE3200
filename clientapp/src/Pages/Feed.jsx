import React from 'react'
import RightNavbar from '../Components/Rightnavbar';
import LeftNavbar from '../Components/Leftnavbar';
import PostFunction from './../Components/Post'
import PostFeed from './../Components/PostFeed';

const Feed = () => {
  return (
    <div className=" bg-gray-100 flex h-screen">
    {/* Left Navbar */}
    <LeftNavbar />
    {/* Post */}
    <PostFunction />
    <PostFeed />
    {/* Right Navbar */}
    <RightNavbar />
    </div>
  )
}

export default Feed