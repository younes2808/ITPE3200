import React, { useState } from 'react';
import '../Styles/Rays.css'; // Juster banen om nødvendig

const TestPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isVideo, setIsVideo] = useState(false);
  const [link, setLink] = useState('');
  const [showLinkInput, setShowLinkInput] = useState(false);

  const fileSelectedHandler = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(URL.createObjectURL(file));
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

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="bg-gray-700 rounded-lg shadow-lg p-6 w-full max-w-xl fixed z-50 top-3"> {/* Oppdatert til fixed og z-index */}
        
        {/* Profil og tekstområdet */}
        <div className="flex items-center mb-4">
          <img
            src="https://via.placeholder.com/40"
            alt="Profile"
            className="w-10 h-10 rounded-full mr-4"
          />
          <textarea
            placeholder="What's happening?"
            className="post-textarea w-full p-4 bg-gray-600 text-white rounded-lg resize-none h-28" // Bruk post-textarea klassen for scrollbar
          />
        </div>

        {/* Input boks for lenke */}
        {showLinkInput && (
          <div className="my-4">
            <input
              type="url"
              value={link}
              onChange={handleLinkChange}
              placeholder="Legg inn lenke..."
              className="w-full p-3 bg-gray-600 text-white rounded-lg hover:bg-gray-500 focus:outline-none" // Hover for input
            />
          </div>
        )}

        {/* Media Preview */}
        {selectedFile && (
          <div className="relative mb-4">
            {isVideo ? (
              <video src={selectedFile} controls className="w-full max-h-60 rounded-lg" />
            ) : (
              <img src={selectedFile} alt="Preview" className="w-full max-h-60 object-cover rounded-lg" />
            )}
            <button
              onClick={removeSelectedFile}
              className="absolute top-0 right-0 bg-white text-black rounded-full w-6 h-6 flex justify-center items-center hover:bg-red-500"
            >
              X
            </button>
          </div>
        )}

        {/* Handling knappene */}
        <div className="flex items-center justify-between space-x-3">
          <div className="flex space-x-2">
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
              Medier
            </label>
            <button
              className="flex items-center justify-center px-2 py-1 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors duration-300 text-sm"
              onClick={toggleLinkInput}
            >
              <span className="material-icons mr-1">link</span>
              Hyperlink
            </button>
            <button className="flex items-center justify-center px-2 py-1 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors duration-300 text-sm">
              <span className="material-icons mr-1">location_on</span>
              Location
            </button>
          </div>

          {/* Post-knappen */}
          <button className="flex items-center justify-center px-3 py-1 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors duration-300 text-sm">
            Post
            <span className="material-icons ml-1">send</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestPage;
