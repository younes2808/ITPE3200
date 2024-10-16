import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importer useNavigate fra react-router-dom

function TopBar() {
  const [showTopBar, setShowTopBar] = useState(true);
  const [userId, setUserId] = useState(null); // Legg til userId state
  const [username, setUsername] = useState(''); // Legg til username state
  let lastScrollY = 0;
  const navigate = useNavigate(); // Bruk useNavigate for navigasjon

  const handleScroll = () => {
    if (window.scrollY > lastScrollY) {
      // Brukeren scroller ned, skjul topbaren
      setShowTopBar(false);
    } else {
      // Brukeren scroller opp, vis topbaren
      setShowTopBar(true);
    }
    lastScrollY = window.scrollY;
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Hente userId og username fra sessionStorage
  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserId(user.id); // Setter userId i state
      setUsername(user.username); // Setter username i state
    }
  }, []);

  return (
    <div
      className={`fixed 510px:hidden top-0 left-0 right-0 bg-gray-900 text-white flex items-center justify-between px-6 py-3 z-50 transition-transform duration-300 ${
        showTopBar ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      {/* Venstre side med "RAYS" */}
      <div className="text-3xl font-light">RAYS</div>

      {/* Høyre side med profilbilde som lenke */}
      <div>
        <a 
         href={`/profile/${userId}`} // Bruker userId fra state
          className="flex items-center hover:bg-gray-800 rounded-lg transition-colors duration-200"
        >
          <div className="text-center pt-1 w-12 h-12 cursor-pointer rounded-full bg-blue-500"> {/* Bruk en farget sirkel */}
            <span className="text-3xl font-semibold">{username.charAt(0).toUpperCase()}</span> {/* Viser første bokstav i brukernavnet */}
          </div>
        </a>
      </div>
    </div>
  );
}

export default TopBar;
