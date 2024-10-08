import React, { useState, useEffect } from 'react';
import '../Styles/Rays.css'; // Adjust the path if necessary'
import { useNavigate } from "react-router-dom";

const TestPage = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [isVideo, setIsVideo] = useState(false);
    const [link, setLink] = useState('');
    const [showLinkInput, setShowLinkInput] = useState(false);
    const [postText, setPostText] = useState('');
    const [location, setLocation] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [userId, setUserId] = useState(null); // Store the userId from sessionStorage

    // Fetch user from sessionStorage when the component mounts
    useEffect(() => {
        const storedUser = sessionStorage.getItem("user");
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUserId(parsedUser.id); // Assuming 'id' is the UserId field
        } else {
            console.error("No user found in sessionStorage.");
        }
    }, []);

    const fileSelectedHandler = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file); // Store the actual file for upload
            setIsVideo(file.type.includes('video'));
        }
    };

    const removeSelectedFile = () => {
        setSelectedFile(null);
        setIsVideo(false);
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

    const handleLocationChange = (event) => {
        setLocation(event.target.value);
    };

    const navigate = useNavigate();

    const postHandler = async () => {
        if (!userId) {
            setError("User not found.");
            return;
        }

        setLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append('Content', postText);
        formData.append('Location', location);
        formData.append('UserId', userId); // Add the userId from sessionStorage
        formData.append('VideoUrl', link); // Append the hyperlink to the FormData
        if (selectedFile) {
            formData.append('Image', selectedFile); // Upload the selected file as 'Image'
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
            setLocation('');
            removeSelectedFile();
            alert('Post created successfully!');
            navigate(0);
        } catch (err) {
            setError('Failed to create post.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center p-2">
            <div className="bg-gray-700 rounded-lg min-w-full p-6 mt-16 510px:mt-3 ">
                {/* Profile image and post textarea */}
                <div className="flex items-center mb-4">
                    <img
                        src="http://localhost:5249/PostImages/beetle.png"
                        alt="Profile"
                        className="w-10 h-10 rounded-full mr-4"
                    />
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

                {/* Location input */}
                <div className="400px:ml-[-0.5rem] 580px:ml-0 my-4">
                    <input
                        type="text"
                        value={location}
                        onChange={handleLocationChange}
                        placeholder="Enter location..."
                        className="w-full p-3 bg-gray-600 text-white rounded-lg hover:bg-gray-500 focus:outline-none"
                    />
                </div>

                {/* Action buttons */}
                <div className="flex items-center justify-start 400px:space-x-2 580px:space-x-0">
                    <div className="flex 400px:ml-[-0.9rem] space-x-1 580px:ml-0 580px:space-x-2 flex-grow">
                        <input
                            style={{ display: 'none' }}
                            type="file"
                            onChange={fileSelectedHandler}
                            id="file-upload-button"
                            accept="image/*,video/*"
                        />
                        <label
                            htmlFor="file-upload-button"
                            className="flex items-center justify-center px-1 580px:px-2 py-1 bg-gray-600 text-white rounded-lg cursor-pointer hover:bg-gray-500 transition-colors duration-300 text-sm"
                        >
                            <span className="material-icons mr-1">photo</span>
                            Media
                        </label>
                        <button
                            className="flex items-center justify-center px-1 580px:px-2 py-1 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors duration-300 text-sm"
                            onClick={toggleLinkInput}
                        >
                            <span className="material-icons mr-1">link</span>
                            Hyperlink
                        </button>
                        <button className="flex items-center justify-center px-1 580px:px-2 py-1 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors duration-300 text-sm">
                            <span className="material-icons mr-1">location_on</span>
                            Location
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

                {error && <p className="text-red-500 mt-4">{error}</p>}
            </div>
        </div>
    );
};

export default TestPage;
