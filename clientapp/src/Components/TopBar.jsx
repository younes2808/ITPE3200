import { useEffect, useState, useRef } from 'react';

function TopBar() {
  const [showTopBar, setShowTopBar] = useState(true);
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState('');
  const lastScrollY = useRef(0);

  const handleScroll = () => {
    console.log("Scroll handler triggered");
    const currentScrollY = window.scrollY;

    console.log("currentScrollY:", currentScrollY);
    console.log("lastScrollY.current:", lastScrollY.current);

    if (currentScrollY > lastScrollY.current) {
      console.log("Scrolling down, hiding top bar");
      setShowTopBar(false);
    } else {
      console.log("Scrolling up, showing top bar");
      setShowTopBar(true);
    }

    lastScrollY.current = currentScrollY;
  };

  useEffect(() => {
    console.log("showTopBar changed:", showTopBar);
  }, [showTopBar]);

  useEffect(() => {
    document.addEventListener('scroll', handleScroll);

    return () => document.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserId(user.id);
      setUsername(user.username);
    }
  }, []);

  return (
    <div
      className={`fixed 510px:hidden top-0 left-0 right-0 bg-gray-900 text-white flex items-center justify-between px-6 py-3 z-50 transition-transform duration-300 ${
        showTopBar ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="text-3xl font-light">RAYS</div>

      <div>
        <a 
         href={`/profile/${userId}`}
          className="flex items-center hover:bg-gray-800 rounded-lg transition-colors duration-200"
        >
          <div className="text-center pt-1 w-12 h-12 cursor-pointer rounded-full bg-blue-500">
            <span className="text-3xl font-semibold">{username.charAt(0).toUpperCase()}</span>
          </div>
        </a>
      </div>
    </div>
  );
}

export default TopBar;