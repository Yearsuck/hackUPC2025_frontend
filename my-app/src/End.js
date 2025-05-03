// End.jsx
import './App.css';

function End({ allResponded, pendingUsers = [], destination, description }) {
  return (
    <div className="end-page">
      {allResponded ? (
        <div className="result-container">
          <h1 className="destination-title">{destination}</h1>
          <p className="destination-description">{description}</p>
        </div>
      ) : (
        <div className="waiting-message">
          <div className="division-party">
            <div className="division-party-image">
              {pendingUsers.length > 0 && (
                <details className="pending-users-dropdown">
                  <summary>Pending users</summary>
                  <ul>
                    {pendingUsers.map((user, index) => (
                      <li key={index}>{user}</li>
                    ))}
                  </ul>
                </details>
              )}
            </div>
            <div className="division-party-text">
              <h1>Some group members haven't responded yet.</h1>
              <p>Please wait for everyone to complete their choices.</p>
              <button className="button" onClick={() => window.location.href = "/Menu"}>
                Back to Menu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default End;
