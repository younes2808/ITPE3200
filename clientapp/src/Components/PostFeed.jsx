import React, { useState, useEffect } from 'react';

const PostFeed = () => {
  const [posts, setPosts] = useState([]);
  const [usernames, setUsernames] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likes, setLikes] = useState({});
  const [userId, setUserId] = useState(null);

  // Fetch user from sessionStorage when the component mounts
  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserId(parsedUser.id); // Assuming 'id' is the UserId field
    }
  }, []);

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

        // Fetch likes for each post
        const likesData = {};
        for (const post of data) {
          const likesResponse = await fetch(`http://localhost:5249/api/Like/${post.id}`);
          const likesInfo = await likesResponse.json();
          likesData[post.id] = likesInfo;
        }
        setLikes(likesData);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  // Toggle like/unlike
  const toggleLike = async (postId) => {
    const alreadyLiked = likes[postId]?.find(like => like.userId === userId);

    try {
      if (alreadyLiked) {
        // Unlike the post
        await fetch('http://localhost:5249/api/Like', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId, postId }),
        });

        // Update state to remove like
        setLikes((prevLikes) => ({
          ...prevLikes,
          [postId]: prevLikes[postId].filter(like => like.userId !== userId),
        }));
      } else {
        // Like the post
        await fetch('http://localhost:5249/api/Like', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId, postId }),
        });

        // Update state to add like
        setLikes((prevLikes) => ({
          ...prevLikes,
          [postId]: [...prevLikes[postId], { userId, likedAt: new Date() }],
        }));
      }
    } catch (error) {
      console.error('Error liking/unliking post:', error);
    }
  };

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
    <div className="p-2 pt-6 mt-auto flex-grow-0 space-y-6 items-start">
      {posts.map((post) => (
        <div key={post.id} className="bg-gray-700 p-3.5 rounded-lg shadow-md">
          {/* Display username based on post.userId */}
          <UsernameDisplay userId={post.userId} fetchUsername={fetchUsername} />

          <h2 className='font-medium font-mono text-slate-100'>
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

          {post.videoUrl && (
            <a href={post.videoUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
              {post.videoUrl}
            </a>
          )}

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
            <span className="text-red-500 font-light pt-20">
              {likes[post.id]?.length || 0} ♡
            </span>
          <div className="flex justify-between mt-2">
                        {/* Display number of likes */}
         
            <button
              onClick={() => toggleLike(post.id)}
              className="text-blue-500 hover:underline"
            >
              {likes[post.id]?.find(like => like.userId === userId) ? 'Liked' : 'Like'}
            </button>



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

  return <h1 className='text-lg font-extrabold font-mono text-slate-50'>{username}</h1>;
};

export default PostFeed;
