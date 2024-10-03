import React, { useState } from 'react';
import UserPost from '../Components/UserPost'; // Importer UserPost

const Profile = ({ loggedInUserId }) => {
  const [username] = useState('exampleUser'); // Eksempelbrukernavn
  const [location] = useState('Oslo, Norway'); // Eksempelplassering
  const [link] = useState('https://example.com'); // Eksempelwebside
  const [bio] = useState('This is an example bio'); // Eksempelbio
  const [activeTab, setActiveTab] = useState('posts'); // For å spore hvilken fane som er aktiv

  // Funksjon for å håndtere faneklikk
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Venstre svart sidebar */}
      <div className="hidden lg:block w-2/12 bg-gray-700"></div> 

      {/* Hovedprofilseksjon */}
      <div className="flex-grow bg-gray-900 p-4 sm:p-6 flex justify-center items-start">
        <div className="w-full max-w-4xl bg-gray-600 p-4 sm:p-6 mx-auto">
          {/* Cover photo */}
          <div className="w-full h-40 sm:h-48 bg-cover bg-center" style={{ backgroundImage: 'url(https://via.placeholder.com/1200x300)' }}></div>

          {/* Profilinformasjon */}
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

          {/* Navigasjonsknapper for Posts, Followers og Following */}
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

          {/* Vise innhold basert på den aktive fanen */}
          <div className="mt-8">
            {activeTab === 'posts' && (
              <>
                <h2 className="text-2xl text-white">Posts</h2>
                <UserPost /> {/* Sender brukerens ID som prop til UserPost */}
              </>
            )}
            {activeTab === 'followers' && (
              <div className="text-white">
                <h2 className="text-2xl">Followers</h2>
                {/* Her kan du implementere logikken for å vise følgere */}
              </div>
            )}
            {activeTab === 'following' && (
              <div className="text-white">
                <h2 className="text-2xl">Following</h2>
                {/* Her kan du implementere logikken for å vise følgere */}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Høyre svart sidebar */}
      <div className="hidden lg:block w-2/12 bg-gray-700"></div> 
    </div>
  );
};

export default Profile;