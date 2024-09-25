import './App.css'; // Import the CSS file that includes Tailwind directives
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './Pages/HomePage';
import TestPage from './Pages/TestPage';
import Register from './Pages/Register';
import Success from './Pages/Success';
import './Styles/Rays.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/test" element={<TestPage/>}/>
        <Route path="/register" element={<Register />} />
        <Route path="/success" element={<Success />} />
      </Routes>
    </Router>
  );
}

export default App;
