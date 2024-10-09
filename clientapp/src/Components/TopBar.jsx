import { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom

function TopBar() {
  const [showTopBar, setShowTopBar] = useState(true);
  const lastScrollY = useRef(0); // Use ref to keep track of the last scroll position
  const navigate = useNavigate(); // Use useNavigate for navigation

  // Memoize handleScroll using useCallback
  const handleScroll = useCallback(() => {
    if (window.scrollY > lastScrollY.current) {
      // User scrolled down, hide the top bar
      setShowTopBar(false);
    } else {
      // User scrolled up, show the top bar
      setShowTopBar(true);
    }
    lastScrollY.current = window.scrollY; // Update lastScrollY
  }, []); // No dependencies for now

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]); // Add handleScroll as a dependency

  return (
    <div
      className={`fixed 510px:hidden top-0 left-0 right-0 bg-gray-900 text-white flex items-center justify-between px-6 py-3 z-50 transition-transform duration-300 ${
        showTopBar ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      {/* Left side with "RAYS" */}
      <div className="text-3xl font-light">RAYS</div>

      {/* Right side with profile picture as a link */}
      <div>
        <a href="#/" onClick={() => navigate('/profile')}> {/* Navigate to profile when clicked */}
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/4/41/Beetlejuice_onstage.jpg" // Add your profile image here
            alt="Profile"
            className="w-12 h-12 rounded-full cursor-pointer" // Add cursor-pointer to indicate it's clickable
          />
        </a>
      </div>
    </div>
  );
}

export default TopBar;
