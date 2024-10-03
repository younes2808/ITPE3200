import React, { useState, useEffect } from 'react';

const UserPost = () => {
  const [posts, setPosts] = useState([]);
  const [usernames, setUsernames] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch the user's posts when the component mounts
  useEffect(() => {
    const fetchUserPosts = async () => {
      console.log("Fetching user posts");
      setLoading(true); // Sett loading til true ved start av fetch

      try {
        // Hent userId fra sessionStorage
        const storedUser = sessionStorage.getItem('user');
        const userId = storedUser ? JSON.parse(storedUser).id : null; // Hent userId fra sessionStorage

        if (!userId) {
          throw new Error('User ID not found in session storage');
        }

        // Fetch posts for the specific user
        const response = await fetch(`http://localhost:5249/api/Post/user/${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch user posts');
        }

        const data = await response.json();
        setPosts(data); // Sett brukerens poster i state
        setLoading(false); // Sett loading til false etter vellykket henting
      } catch (error) {
        setError(error.message);
        setLoading(false); // Sett loading til false ved feil
      }
    };

    fetchUserPosts(); // Kall fetch-funksjonen når komponenten mountes
  }, []); // Tom avhengighetsliste for å kjøre når komponenten mountes

  // Fetch username for a specific userId (on demand)
  const fetchUsername = async (userId) => {
    if (usernames[userId]) {
      return usernames[userId]; // Return cached username if it exists
    }

    try {
      const response = await fetch(`http://localhost:5249/api/User/${userId}`); // Henter brukernavn via ID
      if (!response.ok) {
        throw new Error('Failed to fetch username');
      }
      const userData = await response.json();
      setUsernames((prevUsernames) => ({
        ...prevUsernames,
        [userId]: userData.username, // Cache brukernavnet
      }));
      return userData.username;
    } catch (err) {
      console.error('Error fetching username:', err);
      return 'Unknown User'; // Fallback hvis det skjer en feil
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-800">
        <div className="bg-gray-700 p-6 rounded-lg shadow-lg">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-800">
        <div className="bg-gray-700 p-6 rounded-lg shadow-lg text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="mt-auto flex-grow-0 space-y-6 items-start">
      {posts.length > 0 ? (
        posts.map((post) => (
          <div key={post.id} className="bg-gray-600 p-3.5 rounded-lg shadow-md">
            {/* Vis brukernavn basert på post.userId */}
            <UsernameDisplay userId={post.userId} fetchUsername={fetchUsername} />

            <h2 className='font-medium font-mono text-slate-400'> 
              {new Date(post.createdAt).toLocaleString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false,
              })}
            </h2>

            <h2 className="text-white font-serif">{post.content}</h2>

            {/* Vis video-url hvis den finnes */}
            {post.videoUrl && (
              <a href={post.videoUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                {post.videoUrl}
              </a>
            )}

            {/* Vis lokasjon hvis den finnes */}
            {post.location && (
              <p className="text-green-500">
                {post.location}
              </p>
            )}

            {post.imagePath && (
              <img
                src={`http://localhost:5249/${post.imagePath}`}
                alt="Post"
                className="mt-2 rounded-lg"
              />
            )}

            <div className="flex justify-between mt-2">
              <button className="text-blue-500 hover:underline">Like</button>
              <button className="text-blue-500 hover:underline">Comment</button>
            </div>
          </div>
        ))
      ) : (
        <p className="text-white">No posts to display</p>
      )}
    </div>
  );
};

// Egen komponent for å håndtere brukernavn-visning og henting
const UsernameDisplay = ({ userId, fetchUsername }) => {
  const [username, setUsername] = useState('Loading...');

  useEffect(() => {
    const getUsername = async () => {
      const name = await fetchUsername(userId);
      setUsername(name);
    };
    getUsername();
  }, [userId, fetchUsername]);

  return <h1 className='text-lg font-extrabold font-mono text-slate-50'>{username}</h1>;
};

export default UserPost;
