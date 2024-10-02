import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const Profile = () => {
  const { id } = useParams(); // Hent bruker-ID fra URL-parametere
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState(''); // State for brukernavn
  const [activeTab, setActiveTab] = useState('posts'); // Aktiv tab satt til 'posts' som standard
  const [profileData, setProfileData] = useState(null); // State for profil data

  // State for modal
  const [isModalOpen, setModalOpen] = useState(false);
  const [location, setLocation] = useState('');
  const [link, setLink] = useState('');
  const [bio, setBio] = useState('');

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

    // Hent data for standard tab (posts) ved lasting av komponenten
    fetchData('posts'); // Hent 'posts' data ved lasting
  }, [id]);

  // Funksjon for å oppdatere aktiv tab og hente data
  const handleTabClick = (tab) => {
    setActiveTab(tab);
    fetchData(tab); // Hent data basert på tab
  };

  // Funksjon for å hente data fra API
  const fetchData = async (tab) => {
    try {
      const response = await fetch(`http://localhost:5249/api/User/${userId}`); // Erstatt med riktig API-endepunkt
      const data = await response.json();
      setProfileData(data); // Sett de hentede dataene i state
      setLocation(data.location || ''); // Sett sted
      setLink(data.website || ''); // Sett webadresse
      setBio(data.bio || ''); // Sett bio
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Åpne modal
  const openModal = () => {
    setModalOpen(true);
  };

  // Lukk modal
  const closeModal = () => {
    setModalOpen(false);
  };

  // Lagre oppdaterte data
  const handleSave = () => {
    console.log('Profile Updated:', { username, location, link, bio });
    closeModal(); // Lukk modalen etter oppdatering
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Left black sidebar */}
      <div className="hidden lg:block w-2/12 bg-gray-700"></div> {/* Svart venstre sidebar */}

      {/* Main profile section */}
      <div className="flex-grow bg-gray-600 p-4 sm:p-6 flex justify-center items-start">
        <div className="w-full max-w-4xl bg-gray-700 p-4 sm:p-6 mx-auto">
          {/* Cover photo */}
          <div className="w-full h-40 sm:h-48 bg-cover bg-center" style={{ backgroundImage: 'url(https://via.placeholder.com/1200x300)' }}></div>

          {/* Profile Info */}
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
            <button
              onClick={openModal}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
            >
              Edit Profile
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="mt-8 border-t pt-4">
            <ul className="flex justify-center space-x-4 sm:space-x-8">
              <li onClick={() => handleTabClick('posts')} className={`cursor-pointer ${activeTab === 'posts' ? 'text-blue-500' : 'text-gray-100 hover:text-white hover:bg-gray-400 rounded'}`}>
                Posts
              </li>
              <li onClick={() => handleTabClick('followers')} className={`cursor-pointer ${activeTab === 'followers' ? 'text-blue-500' : 'text-gray-100 hover:text-white hover:bg-gray-400 rounded'}`}>
                Followers
              </li>
              <li onClick={() => handleTabClick('following')} className={`cursor-pointer ${activeTab === 'following' ? 'text-blue-500' : 'text-gray-100 hover:text-white hover:bg-gray-400 rounded'}`}>
                Following
              </li>
            </ul>
          </div>

          {/* Vise innhold basert på aktiv tab */}
          <div className="mt-6 text-white">
            {activeTab === 'posts' && <div>{profileData ? profileData.posts.join(', ') : 'Loading...'}</div>}
            {activeTab === 'followers' && <div>{profileData ? profileData.followers.join(', ') : 'Loading...'}</div>}
            {activeTab === 'following' && <div>{profileData ? profileData.following.join(', ') : 'Loading...'}</div>}
          </div>
        </div>
      </div>

      {/* Right black sidebar */}
      <div className="hidden lg:block w-2/12 bg-gray-700"></div> {/* Svart høyre sidebar */}

      {/* Modal for Edit Profile */}
      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded shadow-lg max-w-sm w-full">
            <h2 className="text-xl font-semibold text-gray-700">Edit Profile</h2>

            {/* Username Input */}
            <div className="mt-4">
              <label className="block text-gray-700">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 p-2 border w-full"
              />
            </div>

            {/* Location Input */}
            <div className="mt-4">
              <label className="block text-gray-700">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="mt-1 p-2 border w-full"
              />
            </div>

            {/* Hyperlink Input */}
            <div className="mt-4">
              <label className="block text-gray-700">Website URL</label>
              <input
                type="url"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                className="mt-1 p-2 border w-full"
              />
            </div>

            {/* Bio Input */}
            <div className="mt-4">
              <label className="block text-gray-700">Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="mt-1 p-2 border w-full"
                rows="4"
              />
            </div>

            <div className="mt-4 flex justify-end space-x-4">
              <button
                onClick={closeModal}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;