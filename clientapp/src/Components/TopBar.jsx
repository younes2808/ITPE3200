import { useEffect, useState, useCallback } from 'react';

function TopBar({ scrollContainer }) {
  const [userId, setUserId] = useState(null); // State for user ID
  const [username, setUsername] = useState(''); // State for username
  const [showTopBar, setShowTopBar] = useState(true); // State to toggle visibility of the top bar
  const [lastScrollY, setLastScrollY] = useState(0); // State to track last scroll position

  // Fetch userId and username from sessionStorage
  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserId(user.id); // Set user ID
      setUsername(user.username); // Set username
    }
  }, []);

  // Function to handle scroll events in a specific container
  const handleScroll = useCallback(() => {
    if (scrollContainer && scrollContainer.current) {
      const currentScrollY = scrollContainer.current.scrollTop;

      // Hide top bar when scrolling down, show when scrolling up
      setShowTopBar(currentScrollY <= lastScrollY);
      setLastScrollY(currentScrollY); // Update last scroll position
    }
  }, [lastScrollY, scrollContainer]);

  useEffect(() => {
    const container = scrollContainer.current; // Capture the current scroll container

    if (container) {
      container.addEventListener('scroll', handleScroll); // Add scroll event listener
    }

    // Cleanup function to remove event listener
    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll); // Clean up on component unmount
      }
    };
  }, [handleScroll, scrollContainer]);

  return (
    <div
      className={`fixed 510px:hidden border-b-2 border-emerald-200 top-0 left-0 right-0 bg-white text-black flex items-center justify-between px-6 py-3 z-50 transition-transform duration-300 ${
        showTopBar ? 'transform translate-y-0' : 'transform -translate-y-full'
      }`}
    >
      {/* Left side with "RAYS" */}
      <div className="text-3xl font-light">RAYS</div>

      {/* Right side with profile image link */}
      <div>
        <a
          href={`/profile/${userId}`}
          className="flex items-center rounded-lg transition-colors duration-200"
        >
          <div className="text-center pt-1 w-12 h-12 cursor-pointer rounded-full hover:bg-emerald-300 bg-emerald-200">
            <span className="text-3xl font-semibold">
              {username.charAt(0).toUpperCase()} {/* Display first letter of username */}
            </span>
          </div>
        </a>
      </div>
    </div>
  );
}

export default TopBar;