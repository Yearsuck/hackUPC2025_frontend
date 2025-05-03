import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import SignUp from './SignUp';
import Login from './Login';
import Menu from './Menu'; // Importa el component Menu
import EditProfile from './EditProfile';

function App() {

  return (
    <div className="App">
      <Router>
      <Routes>
        <Route path="/Home" element={<Home />} />
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Menu" element={<Menu />} /> {/* Ruta per al component Menu */}
        <Route path="/EditProfile" element={<EditProfile />} /> {/* Ruta per al component EditProfile */}
      </Routes>
    </Router>
    </div>
  );
}

export default App;
