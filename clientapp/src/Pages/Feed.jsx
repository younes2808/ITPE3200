import React from 'react'
import RightNavbar from '../Components/Rightnavbar';
import LeftNavbar from '../Components/Leftnavbar';
import PostFunction from './../Components/Post'

const Feed = () => {
  return (
    <div className=" bg-gray-100 flex h-screen">
    {/* Left Navbar */}
    <LeftNavbar />
    {/* Post */}
    <PostFunction />
    {/* Right Navbar */}
    <RightNavbar />
    </div>
  )
}

export default Feed