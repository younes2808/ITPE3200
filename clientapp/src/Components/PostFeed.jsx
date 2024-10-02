import React, { useState, useEffect } from 'react';

const PostFeed = () => {
  const [posts, setPosts] = useState([]);
  const [usernames, setUsernames] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch posts when the component mounts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('http://localhost:5249/api/Post');
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        const data = await response.json();
        setPosts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  // Fetch username for a specific userId (on demand)
  const fetchUsername = async (userId) => {
    if (usernames[userId]) {
      return usernames[userId]; // Return cached username if it exists
    }

    try {
      const response = await fetch(`http://localhost:5249/api/User/${userId}`); // API that fetches user data by ID
      if (!response.ok) {
        throw new Error('Failed to fetch username');
      }
      const userData = await response.json();
      setUsernames((prevUsernames) => ({
        ...prevUsernames,
        [userId]: userData.username, // Cache the username
      }));
      return userData.username;
    } catch (err) {
      console.error('Error fetching username:', err);
      return 'Unknown User'; // Fallback if there's an error
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
    <div className="pt-72 mt-auto flex-grow-0 space-y-6 items-start">
      {posts.map((post) => (
        <div key={post.id} className="bg-gray-700 p-3.5 rounded-lg shadow-md">
          {/* Display username based on post.userId */}
          <UsernameDisplay userId={post.userId} fetchUsername={fetchUsername} />
          <h2 className='font-medium text-slate-900'> 
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
          <h2 className="text-white">{post.content}</h2>
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
      ))}
    </div>
  );
};

// Separate component to handle username display and fetching
const UsernameDisplay = ({ userId, fetchUsername }) => {
  const [username, setUsername] = useState('Loading...');

  useEffect(() => {
    const getUsername = async () => {
      const name = await fetchUsername(userId);
      setUsername(name);
    };
    getUsername();
  }, [userId, fetchUsername]);

  return <h1 className='text-lg font-extrabold font-serif text-slate-50 text-'>{username}</h1>;
};

export default PostFeed;
