import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchUsers } from './../Services/userSearchService'; // Import the service

const UserSearch = () => {
  const [query, setQuery] = useState(''); // State for search query
  const [searchResults, setSearchResults] = useState([]); // State for search results
  const [error, setError] = useState(null); // State for error handling
  const navigate = useNavigate(); // Hook for navigation

  const handleSearch = async () => {
    if (!query) return; // Don't search if query is empty

    try {
      const data = await searchUsers(query); // Call the service function
      setSearchResults(data); // Set search results
      setError(null); // Reset error if successful
    } catch (err) {
      setError(err.message); // Set error message
      setSearchResults([]); // Reset results on error
    }
  };

  return (
    <div className="bg-white shadow-2xl rounded-lg p-8 h-full flex flex-col">
      <h1 className="300px:text-2xl 400px:text-3xl font-extrabold font-general text-black mb-6">User Search</h1>
      <div className="flex "> {/* Set wider max-width for the container */}
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)} // Update query state on change
          placeholder="Search for users..."
          className="300px:p-1 355px:p-3 font-general flex-grow min-w-36 border-gray-300 border-2 rounded-md bg-white text-black placeholder- focus:outline-none focus:ring focus:ring-emerald-500 shadow-md"
        />
        <button 
          onClick={handleSearch} 
          className="ml-2 p-2 bg-blue-600 text-white font-clash rounded-md hover:bg-blue-500 transition duration-200"
        >
          Search
        </button>
      </div>

      {error && <div className="text-red-500 mt-4">{error}</div>} {/* Show error message if exists */}

      {searchResults.length > 0 ? (
        <div className="mt-4 w-2/5 mx-auto max-w-xl">
          <h2 className="font-bold text-center font-general">Search Results:</h2>
          <ul className="mt-2">
            {searchResults.map((user) => (
              <li key={user.id} className="border-b text-center border-gray-600 py-2">
                <button 
                  onClick={() => navigate(`/profile/${user.id}`)} // Navigate to user profile on click
                  className="text-blue-400 hover:underline font-general"
                >
                  {user.username} {/* Display username */}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="mt-4 text-gray-400 font-general">No users found.</div> // Show message if no results
      )}
    </div>
  );
};

export default UserSearch;
