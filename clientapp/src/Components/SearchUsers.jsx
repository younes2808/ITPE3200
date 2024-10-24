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
    <div className="bg-white shadow-2xl rounded-lg p-8 h-full flex flex-col">
      <h1 className="300px:text-2xl 400px:text-3xl font-extrabold font-general text-black mb-6">User Search</h1>
      <div className="flex "> {/* Set wider max-width for the container */}
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for users..."
          className="300px:p-1 355px:p-3 flex-grow min-w-36 border-gray-300 border-2 rounded-md bg-white text-blach placeholder- focus:outline-none focus:ring focus:ring-emerald-500 shadow-md"
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
        <div className=" mt-4 w-2/5 mx-auto max-w-xl">
          <h2 className="font-bold text-center font-general">Search Results:</h2>
          <ul className="mt-2">
            {searchResults.map((user) => (
              <li key={user.id} className="border-b  text-center border-gray-600 py-2">
                <button 
                  onClick={() => navigate(`/profile/${user.id}`)} 
                  className="text-blue-400 hover:underline font-general"
                >
                  {user.username}
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
