import React, { useEffect, useState } from 'react'; 
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { 
  fetchPostsByUserId,  
  fetchLikesByPostId, 
  deletePostById, 
  updatePost, 
  likePost, 
  unlikePost 
} from './../Services/postService';
import { fetchLikedPostsByUserId } from './../Services/likedpostService';
import { fetchUsernameById } from './../Services/userService';

// Initialize Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const PostList = ({ userId, type }) => {
  const [posts, setPosts] = useState([]);
  const [likes, setLikes] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingPostId, setEditingPostId] = useState(null);
  const [postText, setPostText] = useState('');
  const [editErrorMessage, setEditErrorMessage] = useState('');
  const navigate = useNavigate();
  const loggedInUserId = JSON.parse(sessionStorage.getItem('user'))?.id;

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        let data;
        if (type === 'user') {
          data = await fetchPostsByUserId(userId);
        } else if (type === 'liked') {
          data = await fetchLikedPostsByUserId(userId);
        }
        setPosts(data);

        const likesData = {};
        for (const post of data) {
          const likesInfo = await fetchLikesByPostId(post.id);
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
  }, [userId, type]);

  const toggleLike = async (postId) => {
    const alreadyLiked = likes[postId]?.some(like => like.userId === loggedInUserId);
    try {
      if (alreadyLiked) {
        await unlikePost(loggedInUserId, postId);
        console.log("Unliked post!");
        setLikes(prevLikes => ({
          ...prevLikes,
          [postId]: prevLikes[postId].filter(like => like.userId !== loggedInUserId)
        }));
      } else {
        await likePost(loggedInUserId, postId);
        console.log("Liked post!");
        setLikes(prevLikes => ({
          ...prevLikes,
          [postId]: [...(prevLikes[postId] || []), { userId: loggedInUserId, likedAt: new Date() }]
        }));
      }
    } catch (error) {
      console.error('Error liking/unliking post:', error);
    }
  };

  const deletePost = async (postId) => {
    try {
      await deletePostById(postId);
      console.log("Deleted post!");
      setPosts(posts.filter(post => post.id !== postId));
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const editPostHandler = async () => {
    if (!editingPostId || postText.trim() === '') {
      setEditErrorMessage('Post content cannot be empty.');
      return;
    }

    try {
      await updatePost(editingPostId, postText, loggedInUserId);
      setEditingPostId(null);
      setPostText('');
      setEditErrorMessage('');
      const updatedPosts = posts.map(post =>
        post.id === editingPostId ? { ...post, content: postText } : post
      );
      setPosts(updatedPosts);
      console.log("Updated post!");
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  if (loading) {
    return <div>Loading posts...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="mt-auto mb-4 flex-grow-0 space-y-6 items-start">
      {editErrorMessage && (
        <div className="bg-red-200 text-red-600 p-4 rounded-lg">
          {editErrorMessage}
        </div>
      )}

      {posts.map(post => (
        <div key={post.id} className="bg-emerald-200 p-3.5 rounded-lg shadow-md">
          <UsernameDisplay userId={post.userId} fetchUsername={fetchUsernameById} navigate={navigate} />
          <h2 className="font-clash pb-2 font-normal text-sm text-gray-500">
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
              maxLength={1000}
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              className="post-textarea w-full bg-white text-black font-lexend rounded-lg resize-none h-full"
            />
          ) : (
            <h2 className="text-gray-800 mb-1.5 break-words font-lexend font-normal">{post.content}</h2>
          )}

          {post.videoUrl && (
            <a
              href={post.videoUrl.startsWith('http') ? post.videoUrl : `http://${post.videoUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline flex"
            >
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
              className="mt-2 h-50% w-full rounded-lg"
            />
          )}

          <span className="text-red-500 font-light">
            {likes[post.id]?.length || 0} ♡
          </span>

          <div className="flex justify-between mt-2 space-x-4">
            <button onClick={() => toggleLike(post.id)} className="text-blue-500 hover:underline text-xs 400px:text-base">
              {likes[post.id]?.find(like => like.userId === loggedInUserId) ? 'Liked' : 'Like'}
            </button>

            {post.userId === loggedInUserId && editingPostId !== post.id && (
              <>
                <button
                  onClick={() => {
                    setEditingPostId(post.id);
                    setPostText(post.content);
                  }}
                  className="text-yellow-500 hover:underline text-xs 400px:text-base"
                >
                  Edit
                </button>
                <button
                  onClick={() => deletePost(post.id)}
                  className="text-red-500 hover:underline text-xs 400px:text-base"
                >
                  Delete
                </button>
              </>
            )}

            {editingPostId === post.id && (
              <button onClick={editPostHandler} className="text-green-500 hover:underline text-xs 400px:text-base">
                Save
              </button>
            )}
            <button onClick={() => navigate(`/comments/${post.id}`)} className="text-blue-500 hover:underline text-xs 400px:text-base">
              Comment
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

const UsernameDisplay = ({ userId, fetchUsername, navigate }) => {
  const [username, setUsername] = useState('');

  useEffect(() => {
    const fetchAndSetUsername = async () => {
      const name = await fetchUsername(userId);
      setUsername(name);
    };
    fetchAndSetUsername();
  }, [userId, fetchUsername]);

  return (
    <div
      className="font-clash flex items-center space-x-2 cursor-pointer"
      onClick={() => navigate(`/profile/${userId}`)}
    >
      <h2 className="text-xl text-gray-800 font-semibold">{username}</h2>
    </div>
  );
};

// Map component and location parsing
const MapComponent = ({ location }) => {
  const coordinates = parseLocation(location);
  if (!coordinates) return null;

  return (
    <MapContainer center={[coordinates.lat, coordinates.lng]} zoom={5} style={{ height: '200px', width: '100%', zIndex: '0' }}>
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

export default PostList;
