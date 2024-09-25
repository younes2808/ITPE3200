import React, { useState } from 'react';

const TestPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isVideo, setIsVideo] = useState(false);
  const [link, setLink] = useState(''); // Ny state for lenken
  const [showLinkInput, setShowLinkInput] = useState(false); // State for å vise/hide input-boksen

  const fileSelectedHandler = event => {
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
    setShowLinkInput(!showLinkInput); // Veksle synligheten til link input
  };

  const handleLinkChange = (event) => {
    setLink(event.target.value); // Oppdater linkens state
  };

  return (
    <div className="post-box-container">
      <div className="post-box">
        <div className="profile-section">
          <img 
            src="https://via.placeholder.com/40" 
            alt="Profile" 
            className="profile-image" 
          />
          <textarea placeholder="What's happening?" className="post-textarea" rows="4"/>
        </div>
        
        {/* Input boks for lenke */}
        {showLinkInput && (
          <div className="link-input-container" style={{ margin: '15px 0' }}>
            <input 
              type="url" 
              value={link} 
              onChange={handleLinkChange} 
              placeholder="Legg inn lenke..." 
              className="link-input" 
            />
          </div>
        )}

        <div className="media-preview" style={{ position: 'relative' }}> {/* Legg til relativ posisjonering */}
          {selectedFile && (isVideo ? 
            <video src={selectedFile} controls /> : 
            <img src={selectedFile} alt="Preview" />
          )}

          {selectedFile && (
            <button onClick={removeSelectedFile} className="remove-button">
              X
            </button>
          )}
        </div>

        <div className="action-buttons">
          <input 
            style={{display: 'none'}} 
            type="file" 
            onChange={fileSelectedHandler} 
            id="file-upload-button" 
            accept="image/*,video/*" 
          />
          <label htmlFor="file-upload-button" className="action-button media">
            <span className="material-icons">photo</span> 
            Medier
          </label>

          <button 
            className="action-button hyperlink" 
            onClick={toggleLinkInput} // Veksle visning av input-boksen for lenke
          >
            <span className="material-icons">link</span> 
            Hyperlink
          </button>
          <button className="action-button location">
            <span className="material-icons">location_on</span> 
            Location
          </button>
          
          <button className="post-button">
            Post
            <span className="material-icons">send</span> 
          </button>
        </div>
      </div>
    </div>
  );
}

export default TestPage;


