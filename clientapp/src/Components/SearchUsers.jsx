import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UserSearch = () => {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!query) return; // Don't search if query is empty

    try {
      const response = await fetch(`http://localhost:5249/api/user/search?query=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await response.json();
      setSearchResults(data);
      setError(null); // Reset error if successful
    } catch (err) {
      setError(err.message);
      setSearchResults([]); // Reset results on error
    }
  };

  return (
    <div className="bg-gray-800 shadow-lg rounded-lg p-8 h-full flex flex-col">
      <h1 className="text-3xl font-extrabold text-white mb-6">User Search</h1>
      <div className="flex "> {/* Set wider max-width for the container */}
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for users..."
          className="300px:p-1 355px:p-3 flex-grow min-w-36 border border-gray-600 rounded-md bg-gray-900 text-white placeholder-gray-400 focus:outline-none focus:ring focus:ring-gray-500"
        />
        <button 
          onClick={handleSearch} 
          className="ml-2 p-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition duration-200"
        >
          Search
        </button>
      </div>

      {error && <div className="text-red-500 mt-4">{error}</div>}

      {searchResults.length > 0 ? (
        <div className="mt-4 w-2/5 max-w-xl">
          <h2 className="font-bold">Search Results:</h2>
          <ul className="mt-2">
            {searchResults.map((user) => (
              <li key={user.id} className="border-b border-gray-600 py-2">
                <button 
                  onClick={() => navigate(`/profile/${user.id}`)} 
                  className="text-blue-400 hover:underline"
                >
                  {user.username} ({user.email})
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="mt-4 text-gray-400">No users found.</div>
      )}
    </div>
  );
};

export default UserSearch;
