<<<<<<< HEAD
import React from 'react';
import TopBar from '../Components/TopBar';
import RightNavbar from '../Components/RightNavbar';
import LeftNavbar from '../Components/LeftNavbar';
import BottomNavbar from '../Components/BottomNavbar';
import PostFunction from './../Components/Post';
=======
import React from 'react'
import RightNavbar from '../Components/RightNavbar';
import LeftNavbar from '../Components/LeftNavbar';
import PostFunction from './../Components/Post'
>>>>>>> 111f996698d3905b7884bedf8174e451ee0838f8
import PostFeed from './../Components/PostFeed';

const Feed = () => {
  return (
<<<<<<< HEAD
    <div className="bg-gray-800 flex h-screen flex-col"> {/* Legg til flex-col for å justere vertikalt */}
      {/* Top Bar */}
      <TopBar /> 
      <div className="flex flex-grow"> {/* Bruk flex-grow for å fylle plassen */}
        {/* Left Navbar */}
        <LeftNavbar />
=======
    <div className=" bg-gray-100 flex h-screen">
    {/* Left Navbar */}
    <LeftNavbar />
    {/* Post */}
    <div className="w-full bg-gray-800 p-6 flex justify-center items-center ">
    <PostFunction />
    <PostFeed />
    {/* Right Navbar */}
    </div>
    <RightNavbar />
    </div>
  )
}
>>>>>>> 111f996698d3905b7884bedf8174e451ee0838f8

        {/* Post */}
        <div className="w-full 400px:pl-6 400px:pr-6 510px:pl-24 md:pl-44 870px:pl-48 870px:pr-16 970px:pr-56 max-w-870px bg-gray-100 p-6 md:flex-row space-x-0 lg:pl-64 lg:pr-56 1150px:pr-64 px-h-screen overflow-y-auto">
          <PostFunction />
          <PostFeed />
        </div>

        {/* Right Navbar */}
        <RightNavbar />
      </div>

      {/* Bottom Navbar */}
      <BottomNavbar /> 
    </div>
  );
};

export default Feed;
