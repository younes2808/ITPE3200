import React, { useState } from 'react';
import UserPost from '../Components/UserPost'; // Import UserPost component
import LeftNavbar from '../Components/LeftNavbar'; // Import LeftNavbar
import RightNavbar from '../Components/RightNavbar'; // Import RightNavbar

const Profile = ({ loggedInUserId }) => {
  const [username] = useState('exampleUser'); // Example username
  const [location] = useState('Oslo, Norway'); // Example location
  const [link] = useState('https://example.com'); // Example website
  const [bio] = useState('This is an example bio'); // Example bio
  const [activeTab, setActiveTab] = useState('posts'); // Active tab state

  // Handle tab switching
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="flex h-screen overflow-hidden"> {/* Outer container with fixed screen height */}
      {/* Left Navbar */}
      <LeftNavbar />

      {/* Main Content Area */}
      <div className="w-full bg-gray-600 p-6 overflow-y-auto"> {/* Scrollable content area */}
        <div className="w-full max-w-5xl bg-gray-700 p-6 mx-auto rounded-lg">
          {/* Cover Photo */}
          <div 
            className="w-full h-40 sm:h-48 bg-cover bg-center rounded-md"
            style={{ backgroundImage: 'url(https://via.placeholder.com/1200x300)' }}
          ></div>

          {/* Profile Information */}
          <div className="text-center mt-6">
            <img
              src="https://via.placeholder.com/150"
              alt="Profile"
              className="w-24 h-24 sm:w-32 sm:h-32 rounded-full mx-auto border-4 border-white -mt-12"
            />
            <h1 className="text-lg sm:text-2xl font-semibold mt-2 text-white">@{username}</h1>
            <p className="text-gray-300">{location}</p>
            <a href={link} className="text-blue-400 hover:text-white">{link}</a>
            <p className="mt-4 text-gray-300">{bio}</p>
          </div>

          {/* Navigation Tabs */}
          <div className="mt-6 flex justify-center space-x-4">
            <button 
              className={`${activeTab === 'posts' ? 'text-blue-500 font-bold' : 'text-gray-100 hover:text-white hover:bg-gray-400 rounded'}`} 
              onClick={() => handleTabClick('posts')}
            >
              Posts
            </button>
            <button 
              className={`${activeTab === 'followers' ? 'text-blue-500 font-bold' : 'text-gray-100 hover:text-white hover:bg-gray-400 rounded'}`} 
              onClick={() => handleTabClick('followers')}
            >
              Followers
            </button>
            <button 
              className={`${activeTab === 'following' ? 'text-blue-500 font-bold' : 'text-gray-100 hover:text-white hover:bg-gray-400 rounded'}`} 
              onClick={() => handleTabClick('following')}
            >
              Following
            </button>
          </div>

          {/* Active Tab Content */}
          <div className="mt-8">
            {activeTab === 'posts' && (
              <div className="text-white">
                <h2 className="text-2xl">Posts</h2>
                <div className='mt-3'>
                <UserPost /> {/* User posts appear here */}
                </div>
              </div>
            )}
            {activeTab === 'followers' && (
              <div className="text-white">
                <h2 className="text-2xl">Followers</h2>
                {/* Followers logic */}
              </div>
            )}
            {activeTab === 'following' && (
              <div className="text-white">
                <h2 className="text-2xl">Following</h2>
                {/* Following logic */}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Navbar */}
      <RightNavbar />
    </div>
  );
};

export default Profile;

