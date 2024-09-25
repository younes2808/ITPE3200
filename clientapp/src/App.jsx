import './App.css'; // Import the CSS file that includes Tailwind directives
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './Pages/HomePage';
import Feed from './Pages/Feed';
import './Styles/Rays.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/feed' element={<Feed />} />
      </Routes>
    </Router>
  );
}

export default App;
