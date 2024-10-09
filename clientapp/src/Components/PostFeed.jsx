import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; // Import Leaflet CSS
import L from 'leaflet';

// Initialize Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const PostFeed = () => {
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [usernames, setUsernames] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likes, setLikes] = useState({});
  const [userId, setUserId] = useState(null);
  const [editingPostId, setEditingPostId] = useState(null); // Track which post is being edited
  const [postText, setPostText] = useState(''); // Handle editing post content

  // Fetch user from sessionStorage when the component mounts
  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserId(parsedUser.id);
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

  // Handle post deletion
  const deletePost = async (postId) => {
    try {
      const response = await fetch(`http://localhost:5249/api/Post/${postId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete post');
      }
      // Remove the post from state
      setPosts(posts.filter(post => post.id !== postId));
      alert('Post deleted successfully');
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  // Handle edit submission
  const editPostHandler = async () => {
    if (!editingPostId || !userId) return;

    const formData = new FormData();
    formData.append('Content', postText);
    formData.append('UserId', userId);

    try {
      const response = await fetch(`http://localhost:5249/api/Post/${editingPostId}`, {
        method: 'PUT',
        body: formData,
      });
      if (!response.ok) {
        throw new Error('Failed to update post');
      }

      // Reset the editing state and reload posts
      setEditingPostId(null);
      setPostText('');
      alert('Post updated successfully');
      window.location.reload(); // Refresh to show updated post
    } catch (error) {
      console.error('Error updating post:', error);
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
    <div className="pt-72 mt-auto flex-grow-0 max-w-xl max-h-screen space-y-6 items-start">
      {posts.map((post) => (
        <div key={post.id} className="bg-gray-700 p-3.5 rounded-lg shadow-md">
          <UsernameDisplay userId={post.userId} fetchUsername={fetchUsername} navigate={navigate} />

          <h2 className="font-extralight font-mono text-gray-400">
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

          {editingPostId === post.id ? (
            <textarea
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              className="post-textarea w-full p-4 bg-gray-600 text-white rounded-lg resize-none h-28"
            />
          ) : (
            <h2 className="text-white max-w-xl mb-1.5 font-serif break-words">
              {post.content}
            </h2>
          )}


          {post.videoUrl && (
            <a href={post.videoUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
              {post.videoUrl}
            </a>
          )}

          {post.location && (
            <div className="my-4">
              <MapComponent location={post.location} />
            </div>
          )}

          {post.imagePath && (
            <img src={`http://localhost:5249/${post.imagePath}`} alt="Post" className="mt-2 h-50% w-full w-rounded-lg" />
          )}

          <span className="text-red-500 font-light">
            {likes[post.id]?.length || 0} ♡
          </span>

          <div className="flex justify-between space-x-4">
            <button onClick={() => toggleLike(post.id)} className="text-blue-500 hover:underline">
              {likes[post.id]?.find(like => like.userId === userId) ? 'Liked' : 'Like'}
            </button>
            {/* Edit and Delete buttons, only visible for the post's creator */}
            {post.userId === userId && (
              <>
                {editingPostId === post.id ? (
                  <button onClick={editPostHandler} className="text-green-500 hover:underline">
                    Save
                  </button>
                ) : (
                  <button onClick={() => {
                    setEditingPostId(post.id);
                    setPostText(post.content); // Set the post text to be edited
                  }} className="text-yellow-500 hover:underline">
                    Edit
                  </button>
                )}

                <button onClick={() => deletePost(post.id)} className="text-red-500 hover:underline">
                  Delete
                </button>
              </>
            )}
            <button onClick={() => navigate(`/comments/${post.id}`)} className="text-blue-500 hover:underline">
              Comment
            </button>


          </div>
        </div>
      ))}
    </div>
  );
};

// Separate component to handle username display and fetching
const UsernameDisplay = ({ userId, fetchUsername, navigate }) => {
  const [username, setUsername] = useState('Loading...');

  useEffect(() => {
    const getUsername = async () => {
      const name = await fetchUsername(userId);
      setUsername(name);
    };
    getUsername();
  }, [userId, fetchUsername]);

  const handleUsernameClick = () => {
    navigate(`/profile/${userId}`);
  };

  return (
    <button 
      onClick={handleUsernameClick} 
      className="text-2xl font-light font-sans text-slate-100 hover:text-blue-300 hover:underline transition-all duration-200 ease-in-out"
    >
      {username}
    </button>
  );
};

// Map component and location parsing
const MapComponent = ({ location }) => {
  const coordinates = parseLocation(location);
  if (!coordinates) return null;

  return (
    <MapContainer center={[coordinates.lat, coordinates.lng]} zoom={13} style={{ height: '200px', width: '100%', zIndex: '0' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap contributors' />
      <Marker position={[coordinates.lat, coordinates.lng]}>
        <Popup>Lat: {coordinates.lat}, Lng: {coordinates.lng}</Popup>
      </Marker>
    </MapContainer>
  );
};

const parseLocation = (location) => {
  const match = location.match(/Lat:\s*(-?\d+\.?\d*),\s*Lng:\s*(-?\d+\.?\d*)/);
  return match ? { lat: parseFloat(match[1]), lng: parseFloat(match[2]) } : null;
};

export default PostFeed;
