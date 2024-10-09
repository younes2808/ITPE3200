import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Initialize Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const UserPost = ({ userId }) => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [usernames, setUsernames] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likes, setLikes] = useState({});

  useEffect(() => {
    const fetchUserPosts = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:5249/api/Post/user/${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch user posts');
        }

        const data = await response.json();
        setPosts(data);

        // Fetch likes for each post
        const likesData = {};
        for (const post of data) {
          const likesResponse = await fetch(`http://localhost:5249/api/Like/${post.id}`);
          const likesInfo = await likesResponse.json();
          likesData[post.id] = likesInfo; // Store likes in the state
        }
        setLikes(likesData);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserPosts();
    }
  }, [userId]);

  // Toggle like/unlike
  const toggleLike = async (postId) => {
    const alreadyLiked = likes[postId]?.find(like => like.userId === userId);

    try {
      if (alreadyLiked) {
        await fetch('http://localhost:5249/api/Like', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId, postId }),
        });

        setLikes((prevLikes) => ({
          ...prevLikes,
          [postId]: prevLikes[postId].filter(like => like.userId !== userId),
        }));
      } else {
        await fetch('http://localhost:5249/api/Like', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId, postId }),
        });

        setLikes((prevLikes) => ({
          ...prevLikes,
          [postId]: [...(prevLikes[postId] || []), { userId, likedAt: new Date() }],
        }));
      }
    } catch (error) {
      console.error('Error liking/unliking post:', error);
    }
  };

  const fetchUsername = async (userId) => {
    if (usernames[userId]) {
      return usernames[userId]; // Return cached username if it exists
    }

    try {
      const response = await fetch(`http://localhost:5249/api/User/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch username');
      }
      const userData = await response.json();
      setUsernames((prevUsernames) => ({
        ...prevUsernames,
        [userId]: userData.username,
      }));
      return userData.username;
    } catch (err) {
      console.error('Error fetching username:', err);
      return 'Unknown User';
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
    <div className="mt-auto mb-4 flex-grow-0 space-y-6 items-start">
      {posts.length > 0 ? (
        posts.map((post) => (
          <div key={post.id} className="bg-gray-600 p-3.5 rounded-lg shadow-md">
            <UsernameDisplay userId={post.userId} fetchUsername={fetchUsername} navigate={navigate} />

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
              <img
                src={`http://localhost:5249/${post.imagePath}`}
                alt="Post"
                className="mt-2 w-full h-[35vw] rounded-lg"
              />
            )}

            <span className="text-red-500 font-light">
              {likes[post.id]?.length || 0} ♡
            </span>
            <div className="flex justify-between mt-2">
              <button
                onClick={() => toggleLike(post.id)}
                className="text-blue-500 hover:underline"
              >
                {likes[post.id]?.find(like => like.userId === userId) ? 'Liked' : 'Like'}
              </button>

              <button
                onClick={() => navigate(`/comments/${post.id}`)} // Change to your comments route
                className="text-blue-500 hover:underline"
              >
                Comment
              </button>
            </div>
          </div>
        ))
      ) : (
        <p className="text-white">No posts to display</p>
      )}
    </div>
  );
};

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

export default UserPost;
