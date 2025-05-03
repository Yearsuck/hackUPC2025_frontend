import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import SignUp from './SignUp';
import Login from './Login';
import Menu from './Menu';
import EditProfile from './EditProfile';
import InterestsForm from './InterestsForm.js';
import End from './End.js';

function App() {

  return (
    <div className="App">
      <Router>
      <Routes>
        <Route path="/Home" element={<Home />} />
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Menu" element={<Menu />} />
        <Route path="/EditProfile" element={<EditProfile />} />
        <Route path="/InterestsForm" element={<InterestsForm />} />
        <Route path="/End" element={<End />} /> 
      </Routes>
    </Router>
    </div>
  );
}

export default App;
