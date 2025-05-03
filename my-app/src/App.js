import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import SignUp from './SignUp';
import Login from './Login';
import Menu from './Menu'; // Importa el component Menu
import EditProfile from './EditProfile';
import InterestsForm from './InterestsForm.js'; // Importa el component InterestsForm
import End from './End.js'; // Importa el component End

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
        <Route path="/InterestsForm" element={<InterestsForm />} /> {/* Ruta per al component InterestsForm */}
        <Route path="/End" element={<End />} /> {/* Ruta per al component End */}
      </Routes>
    </Router>
    </div>
  );
}

export default App;
