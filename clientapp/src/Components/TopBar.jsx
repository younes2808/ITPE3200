import { useEffect, useState, useCallback } from 'react';

function TopBar() {
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

  // Funksjon for å håndtere scroll-eventet
  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;

    // Sjekk om brukeren scroller ned eller opp
    if (currentScrollY > lastScrollY && currentScrollY > 0) {
      // Hvis brukeren scroller ned, skjul topbaren
      setShowTopBar(false);
    } else {
      // Hvis brukeren scroller opp, vis topbaren
      setShowTopBar(true);
    }

    // Oppdater den siste scrollposisjonen
    setLastScrollY(currentScrollY);
  }, [lastScrollY]);

  useEffect(() => {
    // Legg til scroll-eventlistener når komponenten monteres
    window.addEventListener('scroll', handleScroll);

    // Fjern eventlistener når komponenten demonteres
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

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
