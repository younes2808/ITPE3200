import React, { useState, useEffect, useCallback } from 'react';
import '../Styles/Rays.css'; // Adjust the path if necessary
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; // Import Leaflet CSS
import L from 'leaflet';
import { createPost } from './../Services/createPostService'; // Import the service function

// Initialize the default icon for Leaflet markers
delete L.Icon.Default.prototype._getIconUrl; 
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const PostFunction = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [link, setLink] = useState('');
    const [showLinkInput, setShowLinkInput] = useState(false);
    const [postText, setPostText] = useState('');
    const [location, setLocation] = useState('');
    const [loading, setLoading] = useState(false);
    const [userId, setUserId] = useState(null);
    const [showMap, setShowMap] = useState(false);
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const [showErrorPopup, setShowErrorPopup] = useState(false);

    // Fetch user from sessionStorage
    useEffect(() => {
      const storedUser = sessionStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUserId(parsedUser.id);
        setUsername(parsedUser.username);
      } else {
        console.error("No user found in sessionStorage.");
      }
    }, []);

    // Handle file selection (only allow images)
    const fileSelectedHandler = (event) => {
        const file = event.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                setError('Only image files are allowed.');
                setShowErrorPopup(true);
                setSelectedFile(null); // Clear the selected file if invalid
                return;
            }
            setSelectedFile(file); // Set the file if valid
            setError(''); // Clear any previous errors
        }
    };

    // Remove selected file
    const removeSelectedFile = () => {
        setSelectedFile(null);
    };

    const toggleLinkInput = () => {
        setShowLinkInput(!showLinkInput);
    };

    const handleLinkChange = (event) => {
        setLink(event.target.value);
    };

    const handleTextChange = (event) => {
        setPostText(event.target.value);
        setError('');
    };

    const postHandler = async () => {
        if (!userId) {
            console.log("user not found");
            return;
        }

        if (postText.trim() === '') {
            setError('Please write something before posting.');
            setShowErrorPopup(true);
            return;
        }

        setLoading(true);

        const postData = {
            postText,
            location: typeof location === 'string' ? location : String(location),
            userId,
            link,
            selectedFile,
        };

        try {
            await createPost(postData);
            console.log("Succesfully created post!");
            setPostText('');
            setLink('');
            setLocation('');
            removeSelectedFile();
            window.location.reload();
        } catch (err) {
            console.error('Failed to create post:', err);
        } finally {
            setLoading(false);
        }
    };

    const closeErrorPopup = () => {
        setShowErrorPopup(false);
        setError('');
    };

    return (
        <div className="flex justify-center p-0">
            <div className="bg-emerald-200 rounded-lg min-w-full p-5 mt-16 510px:mt-3 shadow-md">
                <div className="flex items-center mb-4">
                    <span className="flex items-center justify-center w-10 h-10 rounded-full mr-4 bg-white text-lg font-medium text-black">{username.charAt(0).toUpperCase()}</span>
                    <textarea
                        maxLength={1000}
                        value={postText}
                        onChange={handleTextChange}
                        placeholder="What's happening?"
                        className="post-textarea w-full p-4 bg-white focus:ring-emerald-500 focus:ring-2 text-black rounded-lg resize-none h-28"
                    />
                </div>

                {showLinkInput && (
                    <div className="my-4">
                        <input
                            type="url"
                            value={link}
                            onChange={handleLinkChange}
                            placeholder="Enter link..."
                            className="w-full p-3 bg-white focus:ring-emerald-500 focus:ring-2 text-black rounded-lg focus:outline-none"
                        />
                    </div>
                )}

                {selectedFile && (
                    <div className="relative mb-4">
                        <img src={URL.createObjectURL(selectedFile)} alt="Preview" className="w-full max-h-60 object-cover rounded-lg" />
                        <button
                            onClick={removeSelectedFile}
                            className="absolute top-0 right-0 bg-white text-black rounded-full w-6 h-6 flex justify-center items-center hover:bg-red-500"
                        >
                            X
                        </button>
                    </div>
                )}

                <div className="flex items-center justify-start 400px:space-x-2 580px:space-x-0">
                    <div className="flex 300px:ml-[-0.9rem] space-x-1 580px:ml-0 580px:space-x-2 flex-grow">
                        <input
                            style={{ display: 'none' }}
                            type="file"
                            onChange={fileSelectedHandler}
                            id="file-upload-button"
                            accept="image/*"
                        />
                        <label
                            htmlFor="file-upload-button"
                            className="hidden 510px:block items-center justify-center px-2 py-1 bg-white text-black rounded-lg cursor-pointer hover:bg-emerald-500 hover:text-white transition-colors duration-300 text-sm font-general"
                        >
                            <span className="material-icons mr-1">photo</span>
                            Media
                        </label>
                        <button
                            className="flex items-center justify-center px-1 580px:px-2 py-1 bg-white text-black rounded-lg cursor-pointer hover:bg-emerald-500 hover:text-white transition-colors duration-300 text-sm font-general"
                            onClick={toggleLinkInput}
                        >
                            <span className="material-icons mr-1">link</span>
                            Hyperlink
                        </button>
                        <button
                            className="flex items-center justify-center px-1 580px:px-2 py-1 bg-white text-black rounded-lg cursor-pointer hover:bg-emerald-500 hover:text-white transition-colors duration-300 text-sm font-general"
                            onClick={() => {
                                setShowMap(prevState => {
                                    if (prevState) {
                                        setLocation('');
                                    }
                                    return !prevState;
                                });
                            }}
                        >
                            <span className="material-icons mr-1">location_on</span>
                            {showMap ? 'Hide Map' : 'Show Map'}
                        </button>
                    </div>
                    <button
                        onClick={postHandler}
                        className={`flex items-center justify-center px-2 355px:px-3 py-1 bg-blue-600 text-white rounded-full hover:bg-blue-500 transition-colors duration-300 text-sm font-general ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={loading}
                    >
                        {loading ? 'Posting...' : 'Post'}
                        <span className="material-icons ml-1">send</span>
                    </button>
                </div>

                {showErrorPopup && (
                  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                      <div className="bg-white rounded-lg p-5 text-center">
                          <h2 className="text-lg font-bold text-red-600">Error</h2>
                          <p className="mt-2">{error}</p>
                          <button
                              className="mt-4 px-4 py-2 bg-emerald-500 text-white rounded-lg"
                              onClick={closeErrorPopup}
                          >
                              Close
                          </button>
                      </div>
                  </div>
                )}

                {!showErrorPopup && showMap && (
                    <div className="my-4 bg-emerald-200 rounded-lg p-4">
                        <MapContainer
                            center={[20, 0]}
                            zoom={2}
                            style={{ height: '400px', width: '100%' }}
                        >
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            />
                            <MapContent setLocation={setLocation} />
                        </MapContainer>
                        <p className="text-black mt-2">Location: {location}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const MapContent = ({ setLocation }) => {
    const [position, setPosition] = useState(null);
    const map = useMap();

    const handleMapClick = useCallback((event) => {
        const { lat, lng } = event.latlng;
        console.log('Map clicked at:', { lat, lng });
        setPosition([lat, lng]);
        setLocation(`Lat: ${lat.toFixed(5)}, Lng: ${lng.toFixed(5)}`);
    }, [setLocation]);

    useEffect(() => {
        map.on('click', handleMapClick);

        return () => {
            map.off('click', handleMapClick);
        };
    }, [map, handleMapClick]);

    return (
        <>
            {position && (
                <Marker position={position}>
                    <Popup>{`Marker at: ${position[0].toFixed(5)}, ${position[1].toFixed(5)}`}</Popup>
                </Marker>
            )}
        </>
    );
};

export default PostFunction;
