import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const Profile = () => {
  const { id } = useParams(); // Hent bruker-ID fra URL-parametere
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState(''); // Legg til state for brukernavn
  const [activeTab, setActiveTab] = useState('about'); // Legg til state for aktiv tab
  const [profileData, setProfileData] = useState(null); // State for profil data

  // Hent bruker-ID fra sessionStorage eller URL
  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserId(parsedUser.id);
      setUsername(parsedUser.username || ''); // Hent brukernavn fra sessionStorage
    }

    if (id) {
      setUserId(id);
    }

    // Hent data for standard tab (about) ved lasting av komponenten
    fetchData('about'); // Hent 'about' data ved lasting
  }, [id]);

  // Funksjon for å oppdatere aktiv tab og hente data
  const handleTabClick = (tab) => {
    setActiveTab(tab);
    fetchData(tab); // Hent data basert på tab
  };

  // Funksjon for å hente data fra API
  const fetchData = async (tab) => {
    try {
      const response = await fetch("http://localhost:5249/api/User/login") // Erstatt med riktig API-endepunkt
      const data = await response.json();
      setProfileData(data); // Sett de hentede dataene i state
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Left black sidebar */}
      <div className="hidden lg:block w-2/12 bg-black"></div> {/* Svart venstre sidebar */}

      {/* Main profile section */}
      <div className="flex-grow bg-gray-100 p-4 sm:p-6 flex justify-center items-start">
        <div className="w-full max-w-4xl bg-white p-4 sm:p-6 mx-auto">
          {/* Cover photo */}
          <div className="w-full h-40 sm:h-48 bg-cover bg-center" style={{ backgroundImage: 'url(https://via.placeholder.com/1200x300)' }}>
          </div>

          {/* Profile Info */}
          <div className="text-center mt-6">
            <img
              src="https://via.placeholder.com/150"
              alt="Profile"
              className="w-24 h-24 sm:w-32 sm:h-32 rounded-full mx-auto border-4 border-white -mt-12"
            />
            <h1 className="text-lg sm:text-2xl font-semibold mt-2 ">@{username}</h1>
            <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">Edit Profile</button>
          </div>

          {/* Navigation Tabs */}
          <div className="mt-8 border-t pt-4">
            <ul className="flex justify-center space-x-4 sm:space-x-8">
              <li onClick={() => handleTabClick('about')} className={`cursor-pointer ${activeTab === 'about' ? 'text-blue-500' : 'text-gray-600 hover:text-white hover:bg-gray-700 transition duration-300 p-2 rounded'}`}>
                About
              </li>
              <li onClick={() => handleTabClick('posts')} className={`cursor-pointer ${activeTab === 'posts' ? 'text-blue-500' : 'text-gray-600 hover:text-white hover:bg-gray-700 transition duration-300 p-2 rounded'}`}>
                Posts
              </li>
              <li onClick={() => handleTabClick('followers')} className={`cursor-pointer ${activeTab === 'followers' ? 'text-blue-500' : 'text-gray-600 hover:text-white hover:bg-gray-700 transition duration-300 p-2 rounded'}`}>
                Followers
              </li>
              <li onClick={() => handleTabClick('following')} className={`cursor-pointer ${activeTab === 'following' ? 'text-blue-500' : 'text-gray-600 hover:text-white hover:bg-gray-700 transition duration-300 p-2 rounded'}`}>
                Following
              </li>
            </ul>
          </div>

          {/* Vise innhold basert på aktiv tab */}
          <div className="mt-6">
            {activeTab === 'about' && <div>{profileData ? profileData.about : 'Loading...'}</div>}
            {activeTab === 'posts' && <div>{profileData ? profileData.posts.join(', ') : 'Loading...'}</div>}
            {activeTab === 'followers' && <div>{profileData ? profileData.followers.join(', ') : 'Loading...'}</div>}
            {activeTab === 'following' && <div>{profileData ? profileData.following.join(', ') : 'Loading...'}</div>}
          </div>

          {/* Profile Details */}
          <div className="mt-6">
            <h2 className="text-lg sm:text-xl font-bold">Profile Information</h2>
            <p className="mt-2 text-gray-700">Update your account's profile information and email address.</p>
          </div>
        </div>
      </div>

      {/* Right black sidebar */}
      <div className="hidden lg:block w-2/12 bg-black"></div> {/* Svart høyre sidebar */}
    </div>
  );
};

export default Profile;