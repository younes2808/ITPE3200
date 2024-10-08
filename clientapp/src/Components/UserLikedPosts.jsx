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

const UserLikedPosts = ({ userId }) => {
  const [likedPosts, setLikedPosts] = useState([]);
  const [postsDetails, setPostsDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likes, setLikes] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLikedPosts = async () => {
      try {
        const response = await fetch(`http://localhost:5249/api/Post/likedby/${userId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const postIds = await response.json();
        setLikedPosts(postIds); // Set the liked post IDs
      } catch (err) {
        setError(err.message);
      }
    };

    fetchLikedPosts();
  }, [userId]);

  useEffect(() => {
    const fetchPostsDetails = async () => {
      if (likedPosts.length === 0) return; // No liked posts to fetch details for
      try {
        const postsDetailsPromises = likedPosts.map(async (postId) => {
          const response = await fetch(`http://localhost:5249/api/Post/${postId}`);
          if (!response.ok) {
            throw new Error(`Failed to fetch post with ID: ${postId}`);
          }
          return await response.json(); // Return post details
        });

        const details = await Promise.all(postsDetailsPromises);
        setPostsDetails(details);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPostsDetails();
  }, [likedPosts]);

  const toggleLike = async (postId) => {
    // Implement like/unlike functionality
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
          [postId]: [...(prevLikes[postId] || []), { userId, likedAt: new Date() }],
        }));
      }
    } catch (error) {
      console.error('Error liking/unliking post:', error);
    }
  };

  if (loading) {
    return <p className="text-white">Loading liked posts...</p>;
  }

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  if (postsDetails.length === 0) {
    return <p className="text-gray-400">This user hasn't liked any posts yet.</p>;
  }

  return (
    <div className="mt-auto mb-4 flex-grow-0 space-y-6 items-start">
      {postsDetails.map((post) => (
        <div key={post.id} className="bg-gray-600 p-3.5 rounded-lg shadow-md">
          <UsernameDisplay userId={post.userId} navigate={navigate} />

          <h2 className="font-medium font-mono text-slate-400">
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
              className="mt-2  w-full h-[35vw] rounded-lg"
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

            {/* Navigate to CommentsPage with postId */}
            <button 
              onClick={() => navigate(`/comments/${post.id}`)} 
              className="text-blue-500 hover:underline"
            >
              Comment
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

// Separate component to handle username display
const UsernameDisplay = ({ userId, navigate }) => {
  const [username, setUsername] = useState('Loading...');

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const response = await fetch(`http://localhost:5249/api/User/${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch username');
        }
        const userData = await response.json();
        setUsername(userData.username);
      } catch (err) {
        console.error('Error fetching username:', err);
        setUsername('Unknown User');
      }
    };

    fetchUsername();
  }, [userId]);

  return (
    <button 
      onClick={() => navigate(`/profile/${userId}`)} 
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

export default UserLikedPosts;
