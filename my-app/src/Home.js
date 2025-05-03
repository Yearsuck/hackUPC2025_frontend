import './Interest.css';
import './App.css';

function Home() {
  const goToSignUp = () => {
    window.location.href = "/SignUp";
  };

  const goToLogin = () => {
    window.location.href = "/Login";
  };

  return (
    <div className="home-page">
      <div className="top-bar">
        <div className="logo-container">
          <h3 className="logo">LucidRoutes©</h3>
        </div>
        <div className="nav-buttons">
          <button className="nav-button" onClick={goToLogin}>Login</button>
          <button className="nav-button" onClick={goToSignUp}>Sign Up</button>
        </div>
      </div>

      <div className="home-container">
        <h1 className="main-title">LucidRoutes</h1>
        <h2 className="subtitle">Discover the perfect route for your next adventure</h2>
        <button className="button-home" onClick={goToSignUp}>
          Get Started
        </button>
      </div>
    </div>
  );
}

export default Home;
