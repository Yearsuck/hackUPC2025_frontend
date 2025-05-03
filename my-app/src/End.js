import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './App.css';

function End() {
  const [allResponded, setAllResponded] = useState(null);
  const [result, setResult] = useState(null);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { groupId } = useParams();

  const getCookie = (name) => {
    const cookies = document.cookie.split('; ');
    const cookie = cookies.find((row) => row.startsWith(`${name}=`));
    return cookie ? decodeURIComponent(cookie.split('=')[1]) : null;
  };

  useEffect(() => {
    const token = getCookie('auth_token');

    const checkStatus = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/v1/group/${groupId}/status`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (data.all_responded) {
          setAllResponded(true);

          const resultRes = await fetch(`http://localhost:5000/api/v1/group/${groupId}/result`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          const resultData = await resultRes.json();
          setResult(resultData); // { destination: "...", description: "..." }
        } else {
          setAllResponded(false);
          setPendingUsers(data.pending_users || []);
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching status:", err);
        setLoading(false);
      }
    };

    checkStatus();
  }, [groupId]);

  if (loading) {
    return <div className="end-page">Loading...</div>;
  }

  return (
    <div className="end-page">
      {allResponded ? (
        <div className="result-container">
          <h1 className="destination-title">{result.destination}</h1>
          <p className="destination-description">{result.description}</p>
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
              <button className="button" onClick={() => window.location.href = "/Menu"}>Back to Menu</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default End;
