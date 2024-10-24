import { useEffect, useState, useCallback } from 'react';

function TopBar({ scrollContainer }) {
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState('');
  const [showTopBar, setShowTopBar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Hente userId og username fra sessionStorage
  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserId(user.id);
      setUsername(user.username);
    }
  }, []);

  // Funksjon for å håndtere scroll-eventet i en spesifikk container
  const handleScroll = useCallback(() => {
    if (scrollContainer && scrollContainer.current) {
      const currentScrollY = scrollContainer.current.scrollTop;

      if (currentScrollY > lastScrollY) {
        // Hvis brukeren scroller ned, skjul topbaren
        setShowTopBar(false);
      } else {
        // Hvis brukeren scroller opp, vis topbaren
        setShowTopBar(true);
      }

      setLastScrollY(currentScrollY);
    }
  }, [lastScrollY, scrollContainer]);

  useEffect(() => {
    // Capture the current value of scrollContainer to ensure it doesn't change during cleanup
    const container = scrollContainer.current;

    if (container) {
      container.addEventListener('scroll', handleScroll);
    }

    // Cleanup function to remove event listener
    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, [handleScroll, scrollContainer]);

  return (
    <div
      className={`fixed 510px:hidden top-0 left-0 right-0 bg-gray-900 text-white flex items-center justify-between px-6 py-3 z-50 transition-transform duration-300 ${
        showTopBar ? 'transform translate-y-0' : 'transform -translate-y-full'
      }`}
    >
      {/* Venstre side med "RAYS" */}
      <div className="text-3xl font-light">RAYS</div>

      {/* Høyre side med profilbilde som lenke */}
      <div>
        <a
          href={`/profile/${userId}`}
          className="flex items-center hover:bg-gray-800 rounded-lg transition-colors duration-200"
        >
          <div className="text-center pt-1 w-12 h-12 cursor-pointer rounded-full bg-blue-500">
            <span className="text-3xl font-semibold">
              {username.charAt(0).toUpperCase()}
            </span>
          </div>
        </a>
      </div>
    </div>
  );
}

export default TopBar;