import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchUsers } from './../Services/userSearchService'; // Import the service

const UserSearch = () => {
  const [query, setQuery] = useState(''); // State for search query
  const [searchResults, setSearchResults] = useState([]); // State for search results
  const [message, setMessage] = useState(null); // State for messages (error or no results)
  const [isEmptyInput, setIsEmptyInput] = useState(false); // State to check for empty input
  const [hasSearched, setHasSearched] = useState(false); // State to track if a search was performed
  const navigate = useNavigate(); // Hook for navigation

  const handleSearch = async () => {
    setHasSearched(true); // Mark that a search has been initiated

    if (!query.trim()) {
      // If input is empty, set red border and show error
      setIsEmptyInput(true);
      setMessage('Search query cannot be empty.');
      setSearchResults([]); // Clear results if input is invalid
      return;
    }

    try {
      const data = await searchUsers(query); // Call the service function
      if (data.length === 0) {
        setMessage('No users found.'); // Show message if no results
      } else {
        setMessage(null); // Clear any previous messages
      }
      setSearchResults(data); // Set search results
      setIsEmptyInput(false); // Clear input error if query is valid
    } catch (err) {
      setMessage(err.message); // Set error message
      console.error("Error");
      setSearchResults([]); // Reset results on error
    }
  };

  return (
    <div className="bg-white shadow-2xl rounded-lg p-8 h-full flex flex-col">
      <h1 className="300px:text-2xl 400px:text-3xl font-extrabold font-general text-black mb-6">User Search</h1>
      <div className="flex"> {/* Set wider max-width for the container */}
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value); // Update query state on change
            setIsEmptyInput(false); // Clear error when user starts typing
            setMessage(null); // Clear messages while typing
          }}
          placeholder="Search for users..."
          className={`300px:p-1 355px:p-3 font-general flex-grow min-w-36 border-2 rounded-md bg-white text-black focus:outline-none focus:ring-emerald-500 shadow-md ${
            isEmptyInput ? 'border-red-500 placeholder-red-500' : 'border-gray-300'
          }`}
        />
        <button
          onClick={handleSearch}
          className="ml-2 p-2 bg-blue-600 text-white font-clash rounded-md hover:bg-blue-500 transition duration-200"
        >
          Search
        </button>
      </div>

      {message && hasSearched && <div className="text-red-500 mt-4">{message}</div>} {/* Show message only if search has been performed */}

      {searchResults.length > 0 && (
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
      )}
    </div>
  );
};

export default UserSearch;
