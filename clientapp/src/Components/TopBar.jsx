import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importer useNavigate fra react-router-dom

function TopBar() {
  const [showTopBar, setShowTopBar] = useState(true);
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
        <a onClick={() => navigate('/profile')}> {/* Naviger til profil når klikket */}
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/4/41/Beetlejuice_onstage.jpg" // Her kan du legge inn riktig bilde
            alt="Profile"
            className="w-12 h-12 rounded-full cursor-pointer" // Legg til cursor-pointer for å indikere at det er klikkbart
          />
        </a>
      </div>
    </div>
  );
}

export default TopBar;
