import './App.css'; // Import the CSS file that includes Tailwind directives
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './Pages/HomePage';
import Feed from './Pages/Feed';
import TestPage from './Pages/TestPage';
import Register from './Pages/Register';
import Profile from './Pages/Profile';
import CommentsPage from './Pages/CommentsPage'; 
import ConversationPage from "./Pages/ConversationPage"; // Make sure to create this component for the conversation list
import MessagePage from "./Pages/MessagePage"; 
import FriendRequests from './Pages/FriendRequests';
import './Styles/Rays.css';
import Search from './Pages/Search';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/feed' element={<Feed />} />
        <Route path="/test" element={<TestPage/>}/>
        <Route path="/comments/:postId" element={<CommentsPage />} /> {/* Route to CommentsPage */}
        <Route path="/register" element={<Register />} />
        <Route path="/profile/:userId" element={<Profile />} />
        <Route path="/search" element={<Search />} />
        <Route path="/conversation/:userId" element={<ConversationPage />} />
        <Route path="/message/:receiverId/:senderId" element={<MessagePage />} />
        <Route path="/friend-requests" element={<FriendRequests />} /> {/* Route for Friend Requests page */}
      </Routes>
    </Router>
  );
}

export default App;
