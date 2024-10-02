import './App.css'; // Import the CSS file that includes Tailwind directives
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './Pages/HomePage';
import Feed from './Pages/Feed';
import TestPage from './Pages/TestPage';
import Register from './Pages/Register';
import Success from './Pages/Success';
import Profile from './Pages/Profile';
import './Styles/Rays.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/feed' element={<Feed />} />
        <Route path="/test" element={<TestPage/>}/>
        <Route path="/register" element={<Register />} />
        <Route path="/success" element={<Success />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;
