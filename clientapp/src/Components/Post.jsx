import React, { useState, useEffect, useCallback } from 'react';
import '../Styles/Rays.css'; // Adjust the path if necessary
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; // Import Leaflet CSS
import L from 'leaflet';

// Initialize the default icon for Leaflet markers
delete L.Icon.Default.prototype._getIconUrl; 
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Main map component for TestPage
    const TestPage = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [isVideo, setIsVideo] = useState(false);
    const [link, setLink] = useState('');
    const [showLinkInput, setShowLinkInput] = useState(false);
    const [postText, setPostText] = useState('');
    const [location, setLocation] = useState(''); // Holds the location string
    const [loading, setLoading] = useState(false);
    const [userId, setUserId] = useState(null);
    const [showMap, setShowMap] = useState(false);
    const [username, setUsername] = useState(''); // State to store username
  
  
    // Fetch user from sessionStorage
    useEffect(() => {
      const storedUser = sessionStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUserId(parsedUser.id);
        setUsername(parsedUser.username); // Set username
      } else {
        console.error("No user found in sessionStorage.");
      }
    }, []);

  const fileSelectedHandler = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setIsVideo(file.type.includes('video'));
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null); // Clear selected file
    setIsVideo(false); // Reset video flag
  };

  const toggleLinkInput = () => {
    setShowLinkInput(!showLinkInput);
  };

  const handleLinkChange = (event) => {
    setLink(event.target.value);
  };

  const handleTextChange = (event) => {
    setPostText(event.target.value);
  };

  // Optional: You can comment out handleLocationChange if not used
  // const handleLocationChange = (event) => {
  //     setLocation(event.target.value);
  // };

  const postHandler = async () => {
    if (!userId) {
      console.log("user not found");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('Content', postText);
    
    // Ensure location is a string
    formData.append('Location', typeof location === 'string' ? location : String(location)); 
    formData.append('UserId', userId);
    formData.append('VideoUrl', link);
    
    if (selectedFile) {
      formData.append('Image', selectedFile);
    }

    try {
      const response = await fetch('http://localhost:5249/api/Post', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        throw new Error('Failed to post');
      }

      // Reset form after successful submission
      setPostText('');
      setLink('');
      setLocation(''); // Reset location
      removeSelectedFile(); // Clear the selected file
      window.location.reload();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-grow-0 items-center bg-gray-800">
      <div className="bg-gray-700 rounded-lg px-18 min-px-6 min-w-80 shadow-lg p-6 fixed z-50 top-3 ">
        {/* Profile image and post textarea */}
        <div className="flex items-center mb-4">
          <span className="text-lg font-semibold">{username.charAt(0).toUpperCase()}</span> {/* Display the first letter of the username */}
        
          
          <textarea
            value={postText}
            onChange={handleTextChange}
            placeholder="What's happening?"
            className="post-textarea w-full p-4 bg-gray-600 text-white rounded-lg resize-none h-28"
          />
        </div>

        {/* Input for link */}
        {showLinkInput && (
          <div className="my-4">
            <input
              type="url"
              value={link}
              onChange={handleLinkChange}
              placeholder="Enter link..."
              className="w-full p-3 bg-gray-600 text-white rounded-lg hover:bg-gray-500 focus:outline-none"
            />
          </div>
        )}

        {/* Media preview */}
        {selectedFile && (
          <div className="relative mb-4">
            {isVideo ? (
              <video src={URL.createObjectURL(selectedFile)} controls className="w-full max-h-60 rounded-lg" />
            ) : (
              <img src={URL.createObjectURL(selectedFile)} alt="Preview" className="w-full max-h-60 object-cover rounded-lg" />
            )}
            <button
              onClick={removeSelectedFile}
              className="absolute top-0 right-0 bg-white text-black rounded-full w-6 h-6 flex justify-center items-center hover:bg-red-500"
            >
              X
            </button>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex items-center justify-between space-x-4 md:space-x-9 lg:space-x-14">
          <div className="flex space-x-2 md:space-x-3.5 lg:space-x-12">
            <input
              style={{ display: 'none' }}
              type="file"
              onChange={fileSelectedHandler}
              id="file-upload-button"
              accept="image/*,video/*"
            />
            <label
              htmlFor="file-upload-button"
              className="flex items-center justify-center px-2 py-1 bg-gray-600 text-white rounded-lg cursor-pointer hover:bg-gray-500 transition-colors duration-300 text-sm"
            >
              <span className="material-icons mr-1">photo</span>
              Media
            </label>
            <button
              className="flex items-center justify-center px-2 py-1 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors duration-300 text-sm"
              onClick={toggleLinkInput}
            >
              <span className="material-icons mr-1">link</span>
              Hyperlink
            </button>

            {/* Show Map button */}
            <button
              className="flex items-center justify-center px-2 py-1 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors duration-300 text-sm"
              onClick={() => {
                setShowMap(prevState => !prevState); // Toggle the visibility of the map
              }}
            >
              <span className="material-icons mr-1">location_on</span>
              {showMap ? 'Hide Map' : 'Show Map'}
            </button>
          </div>

          {/* Post button */}
          <button
            onClick={postHandler}
            className={`flex items-center justify-center px-3 py-1 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors duration-300 text-sm ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            {loading ? 'Posting...' : 'Post'}
            <span className="material-icons ml-1">send</span>
          </button>
        </div>

        {/* Interactive Map for Location */}
        {showMap && (
          <div className="my-4 bg-gray-600 rounded-lg p-4">
            <MapContainer
              center={[20, 0]} // Center the map on load
              zoom={2} // Initial zoom level
              style={{ height: '400px', width: '100%' }} // Ensure the map takes full space
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <MapContent setLocation={setLocation} /> {/* Pass setLocation to MapContent */}
            </MapContainer>
            <p className="text-white mt-2">Location: {location}</p> {/* Display selected location */}
          </div>
        )}
      </div>
    </div>
  );
};

// Separate component for map interactions
const MapContent = ({ setLocation }) => {
  const [position, setPosition] = useState(null); // Position state for marker
  const map = useMap(); // Access the map instance

  const handleMapClick = useCallback((event) => {
    const { lat, lng } = event.latlng; // Get the lat and lng from the click event
    console.log('Map clicked at:', { lat, lng }); // Debug log
    setPosition([lat, lng]); // Update position state with lat and lng
    setLocation(`Lat: ${lat.toFixed(5)}, Lng: ${lng.toFixed(5)}`); // Update location state with formatted string
  }, [setLocation]); // Dependencies are now stable

  // Attach the click event handler to the map when the component mounts
  useEffect(() => {
    map.on('click', handleMapClick); // Attach the click event to the map

    return () => {
      map.off('click', handleMapClick); // Clean up the event listener on component unmount
    };
  }, [map, handleMapClick]); // Now all dependencies are included and stable

  return (
    <>
      {position && ( // Render marker only if position is set
        <Marker position={position}>
          <Popup>{`Marker at: ${position[0].toFixed(5)}, ${position[1].toFixed(5)}`}</Popup> {/* Optional: Show coordinates in popup */}
        </Marker>
      )}
    </>
  );
};

export default TestPage;
